import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './auth.interface';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository
  ) {}

  private getRolesForClient(roles: any[], clientId?: number | null) {
    if (!roles || roles.length === 0) return [];
    if (!clientId) {
      return roles.filter((role) => role.client_id == null);
    }
    const targetId = Number(clientId);
    return roles.filter(
      (role) => (role.client_id != null && Number(role.client_id) === targetId) || role.client_id == null,
    );
  }

  async login(createAuthDto: CreateAuthDto): Promise<Auth> {
    const user = await this.userRepository.getOne(0, createAuthDto.email);

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const validPassword = await bcrypt.compare(
      createAuthDto.password,
      user.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const fullUser = await this.userRepository.getOneWithRoles(user.id);
    const allClients = fullUser?.clients || [];
    const allRoles = fullUser?.roles || [];

    // Filtrar clínicas para as quais o usuário tem permissão (role)
    const availableClientsWithRoles = allClients.filter((client) => {
      const clientRoles = this.getRolesForClient(allRoles, client.id);
      return clientRoles.length > 0;
    });

    if (allClients.length > 0 && availableClientsWithRoles.length === 0) {
      throw new UnauthorizedException('Usuário não possui nenhuma função/permissão (role) vinculada a suas clínicas');
    }

    // Se o usuário não enviou client_id e possui mais de 1 clínica com roles vinculadas
    if (availableClientsWithRoles.length > 1 && !createAuthDto.client_id) {
      return {
        requires_client_selection: true,
        clients: availableClientsWithRoles,
      };
    }

    let selectedClient: any = null;

    if (createAuthDto.client_id) {
      selectedClient = allClients.find((c) => c.id === createAuthDto.client_id);
      if (!selectedClient) {
        throw new UnauthorizedException('Clínica selecionada não está vinculada a este usuário');
      }

      const clientRoles = this.getRolesForClient(allRoles, selectedClient.id);
      if (clientRoles.length === 0) {
        throw new UnauthorizedException('Usuário não possui nenhuma permissão (role) vinculada a esta clínica');
      }
    } else if (availableClientsWithRoles.length === 1) {
      selectedClient = availableClientsWithRoles[0];
    } else if (allClients.length === 1) {
      selectedClient = allClients[0];
      const clientRoles = this.getRolesForClient(allRoles, selectedClient.id);
      if (clientRoles.length === 0) {
        throw new UnauthorizedException('Usuário não possui nenhuma permissão (role) vinculada a esta clínica');
      }
    }

    const rolesForSelectedClient = selectedClient
      ? this.getRolesForClient(allRoles, selectedClient.id)
      : allRoles;

    const payload: any = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    if (selectedClient) {
      payload.client_id = selectedClient.id;
    }

    const token = this.jwtService.sign(payload);

    return { 
      user: {
        ...fullUser,
        client: selectedClient,
        roles: rolesForSelectedClient,
      },
      access_token: token 
    };
  }

  async me(token: string): Promise<Auth> {
    const replaceToken = token.replace('Bearer ', '');
    const payload = this.jwtService.verify(replaceToken);

    const fullUser = await this.userRepository.getOneWithRoles(payload.id);
    if (!fullUser) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const targetClientId = payload.client_id ? Number(payload.client_id) : null;
    const selectedClient = targetClientId
      ? fullUser.clients?.find((c) => Number(c.id) === targetClientId)
      : fullUser.clients?.[0] || null;

    const rolesForSelectedClient = selectedClient
      ? this.getRolesForClient(fullUser.roles || [], selectedClient.id)
      : fullUser.roles || [];

    return {
      user: {
        ...fullUser,
        client: selectedClient,
        roles: rolesForSelectedClient,
      },
      access_token: replaceToken,
    };
  }

  async switchClient(userId: number, clientId: number): Promise<Auth> {
    const fullUser = await this.userRepository.getOneWithRoles(userId);
    if (!fullUser) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const allClients = fullUser.clients || [];
    const allRoles = fullUser.roles || [];

    const targetClientId = Number(clientId);
    const selectedClient = allClients.find((c) => Number(c.id) === targetClientId);
    if (!selectedClient) {
      throw new UnauthorizedException('Clínica selecionada não está vinculada a este usuário');
    }

    const clientRoles = this.getRolesForClient(allRoles, selectedClient.id);
    if (clientRoles.length === 0) {
      throw new UnauthorizedException('Usuário não possui nenhuma permissão (role) vinculada a esta clínica');
    }

    const payload = {
      id: fullUser.id,
      email: fullUser.email,
      name: fullUser.name,
      client_id: selectedClient.id,
    };

    const token = this.jwtService.sign(payload);

    return {
      user: {
        ...fullUser,
        client: selectedClient,
        roles: clientRoles,
      },
      access_token: token,
    };
  }

}

