import { Injectable } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { CreateRoleDto } from './dto/create-roles.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>,
        private readonly discoveryService: DiscoveryService,
        private readonly metadataScanner: MetadataScanner,
    ) {}

    findAll(client_id?: number) {
        return this.roleRepository.find({
            where: client_id ? [{ client_id }, { client_id: IsNull() }] : {},
            relations: ['client'],
        });
    }

    create(role: CreateRoleDto, user?: any) {
        const { client_id, ...rest } = role;
        const targetClientId = client_id || user?.clients?.[0]?.id || user?.clientId;

        return this.roleRepository.save({
            ...rest,
            ...(targetClientId ? { client_id: targetClientId, client: { id: targetClientId } } : {}),
        });
    }

    async rolesAdm() {
        const permissions: { controller: string; method: string }[] = [];

        const controllers = this.discoveryService.getControllers();

        for (const wrapper of controllers) {
            const { instance } = wrapper;
            if (!instance) continue;

            const controllerName = instance.constructor.name;
            const prototype = Object.getPrototypeOf(instance);

            const methods = this.metadataScanner.getAllMethodNames(prototype);

            for (const method of methods) {
                permissions.push({ controller: controllerName, method });
            }
        }

        const existing = await this.roleRepository.findOne({ where: { name: 'ADMINISTRADOR' } });

        if (existing) {
            return this.roleRepository.save({ ...existing, permissions });
        }

        return this.roleRepository.save({ name: 'ADMINISTRADOR', permissions });
    }

}
