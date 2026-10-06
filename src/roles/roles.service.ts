import { Injectable } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { CreateRoleDto } from './dto/create-roles.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>,
        private readonly discoveryService: DiscoveryService,
        private readonly metadataScanner: MetadataScanner,
    ) {}

    findAll() {
        return this.roleRepository.find();
    }
    create(role: CreateRoleDto) {
        return this.roleRepository.save(role);
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
