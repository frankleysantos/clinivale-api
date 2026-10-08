import { Injectable, NotFoundException } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { CreateRoleDto } from './dto/create-roles.dto';
import { UpdateRoleDto } from './dto/update-roles.dto';
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

    findOne(id: number) {
        return this.roleRepository.findOne({
            where: { id },
            relations: ['client'],
        });
    }

    create(role: CreateRoleDto, user?: any) {
        const { client_id, ...rest } = role;
        const targetClientId = client_id || user?.client?.id || user?.clientId || user?.clients?.[0]?.id;

        return this.roleRepository.save({
            ...rest,
            ...(targetClientId ? { client_id: targetClientId, client: { id: targetClientId } } : {}),
        });
    }

    async update(id: number, updateRoleDto: UpdateRoleDto, user?: any) {
        const role = await this.roleRepository.findOneBy({ id });
        if (!role) {
            throw new NotFoundException('Perfil não encontrado');
        }

        const { client_id, ...rest } = updateRoleDto;
        Object.assign(role, rest);

        const targetClientId = client_id || user?.client?.id || user?.clientId || user?.clients?.[0]?.id;
        if (targetClientId) {
            role.client_id = targetClientId;
        }

        return this.roleRepository.save(role);
    }

    async remove(id: number) {
        const role = await this.roleRepository.findOneBy({ id });
        if (!role) {
            throw new NotFoundException('Perfil não encontrado');
        }
        await this.roleRepository.delete(id);
        return { message: 'Perfil removido com sucesso' };
    }

    async getAvailablePermissions() {
        const controllersMap: Record<string, { label: string; methods: { name: string; label: string }[] }> = {
            PatientController: {
                label: 'Pacientes',
                methods: [
                    { name: 'create', label: 'Criar Paciente' },
                    { name: 'findAll', label: 'Listar Pacientes' },
                    { name: 'findOne', label: 'Visualizar Paciente' },
                    { name: 'update', label: 'Editar Paciente' },
                    { name: 'remove', label: 'Excluir Paciente' },
                ],
            },
            UserController: {
                label: 'Usuários',
                methods: [
                    { name: 'create', label: 'Criar Usuário' },
                    { name: 'findAll', label: 'Listar Usuários' },
                    { name: 'findOne', label: 'Visualizar Usuário' },
                    { name: 'update', label: 'Editar Usuário' },
                    { name: 'remove', label: 'Excluir Usuário' },
                ],
            },
            ClientController: {
                label: 'Clientes / Estabelecimentos',
                methods: [
                    { name: 'create', label: 'Criar Cliente' },
                    { name: 'findAll', label: 'Listar Clientes' },
                    { name: 'findOne', label: 'Visualizar Cliente' },
                    { name: 'update', label: 'Editar Cliente' },
                    { name: 'remove', label: 'Excluir Cliente' },
                ],
            },
            RolesController: {
                label: 'Perfis e Permissões',
                methods: [
                    { name: 'createRoles', label: 'Criar Perfil' },
                    { name: 'getAllRoles', label: 'Listar Perfis' },
                    { name: 'updateRole', label: 'Editar Perfil' },
                    { name: 'removeRole', label: 'Excluir Perfil' },
                ],
            },
        };

        const controllers = this.discoveryService.getControllers();
        const result: Array<{
            controller: string;
            label: string;
            methods: Array<{ name: string; label: string }>;
        }> = [];

        for (const wrapper of controllers) {
            const { instance } = wrapper;
            if (!instance) continue;

            const controllerName = instance.constructor.name;
            if (controllerName === 'AppController' || controllerName === 'AuthController') continue;

            const prototype = Object.getPrototypeOf(instance);
            const methodNames = this.metadataScanner.getAllMethodNames(prototype);

            const known = controllersMap[controllerName];
            const label = known?.label || controllerName;

            const methods = methodNames.map((m) => {
                const knownMethod = known?.methods.find((km) => km.name === m);
                return {
                    name: m,
                    label: knownMethod?.label || m,
                };
            });

            result.push({
                controller: controllerName,
                label,
                methods,
            });
        }

        return result;
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

