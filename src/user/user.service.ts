import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { DeepPartial } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  
  constructor(private readonly userRepository: UserRepository) {}

  create(createUserDto: CreateUserDto, user?: any) {
    const activeClientId = user?.client?.id || user?.clientId || user?.clients?.[0]?.id;
    const isMasterClinic = Number(activeClientId) === 1 || user?.client?.name?.toLowerCase() === 'clinivale';

    const { client_id, role_ids, ...rest } = createUserDto;

    // Se o usuário tentar passar um client_id diferente do seu e não for a clínica master (ID 1)
    if (client_id && Number(client_id) !== Number(activeClientId) && !isMasterClinic) {
      throw new ForbiddenException('Apenas usuários da clínica principal (ID: 1) podem cadastrar usuários para outros clientes.');
    }

    const targetClientId = client_id || activeClientId;

    if (!targetClientId) {
      throw new BadRequestException('ID do cliente não informado ou usuário sem clínica vinculada');
    }

    if (rest.password) {
      rest.password = bcrypt.hashSync(rest.password, 10);
    }

    const partial: DeepPartial<UserEntity> = {
      ...rest,
      clients: [{ id: targetClientId }],
    };
    return this.userRepository.created(partial, role_ids);
  }

  findAll(client_id?: number) {
    return this.userRepository.getAll(client_id);
  }

  findOne(id: number, email: string, client_id?: number) {
    if (id) {
      return this.userRepository.getOneWithRoles(id, client_id);
    }
    return this.userRepository.getOne(id, email);
  }

  update(id: number, updateUserDto: UpdateUserDto & { role_ids?: number[] }, loggedUserClientId?: number) {
    if (updateUserDto.password) {
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
    }
    return this.userRepository.update(id, updateUserDto, loggedUserClientId);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}

