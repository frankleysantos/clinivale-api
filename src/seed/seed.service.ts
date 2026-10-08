import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { ClientEntity } from 'src/client/entities/client.entity';
import { RoleEntity } from 'src/roles/entities/role.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.runSeed();
    } catch (error) {
      this.logger.error('Erro ao executar seed automático no bootstrap:', error);
    }
  }

  async runSeed() {
    this.logger.log('Iniciando execução de seed...');

    // 1. Criar ou buscar o cliente master "Clinivale"
    let clinivaleClient = await this.clientRepository.findOne({
      where: [{ name: 'Clinivale' }, { name: 'CLINIVALE' }],
    });

    if (!clinivaleClient) {
      clinivaleClient = await this.clientRepository.save({
        name: 'Clinivale',
        type: 'JURIDICA',
        cnpj: '12345678000195',
        email: 'admin@clinivale.com',
        cellphone: '11999999999',
        status: 'ATIVO',
      });
      this.logger.log(`Cliente master Clinivale criado com ID: ${clinivaleClient.id}`);
    }

    // 2. Mapear todas as permissões (controllers e métodos) do sistema
    const permissions: Array<{ controller: string; method: string }> = [];
    const controllers = this.discoveryService.getControllers();

    for (const wrapper of controllers) {
      const { instance } = wrapper;
      if (!instance) continue;

      const controllerName = instance.constructor.name;
      if (controllerName === 'AppController') continue;

      const prototype = Object.getPrototypeOf(instance);
      const methods = this.metadataScanner.getAllMethodNames(prototype);

      for (const method of methods) {
        permissions.push({ controller: controllerName, method });
      }
    }

    // 3. Criar ou atualizar a role "ADMINISTRADOR" total para a clínica Clinivale
    let adminRole = await this.roleRepository.findOne({
      where: [
        { name: 'ADMINISTRADOR', client_id: clinivaleClient.id },
        { name: 'ADMINISTRADOR', client_id: null },
      ],
    });

    if (adminRole) {
      adminRole.permissions = permissions;
      adminRole.client_id = clinivaleClient.id;
      adminRole = await this.roleRepository.save(adminRole);
      this.logger.log(`Role ADMINISTRADOR atualizada com ${permissions.length} permissões`);
    } else {
      adminRole = await this.roleRepository.save({
        name: 'ADMINISTRADOR',
        permissions,
        client_id: clinivaleClient.id,
      });
      this.logger.log(`Role ADMINISTRADOR criada com ID: ${adminRole.id}`);
    }

    // 4. Criar ou atualizar o usuário master "clinivale" (admin@clinivale.com)
    let adminUser = await this.userRepository.findOne({
      where: { email: 'admin@clinivale.com' },
      relations: ['clients', 'roles'],
    });

    const hashedPassword = bcrypt.hashSync('123456', 10);

    if (!adminUser) {
      adminUser = await this.userRepository.save({
        name: 'Administrador Clinivale',
        email: 'admin@clinivale.com',
        password: hashedPassword,
        clients: [clinivaleClient],
        roles: [adminRole],
      });
      this.logger.log(`Usuário master Clinivale criado com ID: ${adminUser.id}`);
    } else {
      adminUser.name = 'Administrador Clinivale';
      adminUser.password = hashedPassword;

      // Garantir vínculos
      const hasClient = adminUser.clients?.some((c) => Number(c.id) === Number(clinivaleClient.id));
      if (!hasClient) {
        adminUser.clients = [...(adminUser.clients || []), clinivaleClient];
      }

      const hasRole = adminUser.roles?.some((r) => Number(r.id) === Number(adminRole.id));
      if (!hasRole) {
        adminUser.roles = [...(adminUser.roles || []), adminRole];
      }

      adminUser = await this.userRepository.save(adminUser);
      this.logger.log(`Usuário master Clinivale atualizado com sucesso (ID: ${adminUser.id})`);
    }

    return {
      message: 'Seed do cliente Clinivale e usuário ADMINISTRADOR concluído com sucesso!',
      client: {
        id: clinivaleClient.id,
        name: clinivaleClient.name,
      },
      role: {
        id: adminRole.id,
        name: adminRole.name,
        permissionsCount: permissions.length,
      },
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
      },
    };
  }
}
