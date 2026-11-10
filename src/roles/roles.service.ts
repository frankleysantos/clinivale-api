import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
        const activeClientId = user?.client?.id || user?.clientId || user?.clients?.[0]?.id;
        const isMasterClinic = Number(activeClientId) === 1 || user?.client?.name?.toLowerCase() === 'clinivale';

        const { client_id, ...rest } = role;

        // Se passar um client_id diferente do seu e não for a clínica master (ID 1 ou Clinivale)
        if (client_id && Number(client_id) !== Number(activeClientId) && !isMasterClinic) {
            throw new ForbiddenException('Apenas usuários da clínica principal (ID: 1) podem criar perfis para outros clientes.');
        }

        const targetClientId = client_id || activeClientId;

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

        const activeClientId = user?.client?.id || user?.clientId || user?.clients?.[0]?.id;
        const isMasterClinic = Number(activeClientId) === 1 || user?.client?.name?.toLowerCase() === 'clinivale';

        const { client_id, ...rest } = updateRoleDto;

        if (client_id && Number(client_id) !== Number(activeClientId) && !isMasterClinic) {
            throw new ForbiddenException('Apenas usuários da clínica principal (ID: 1) podem alterar o cliente deste perfil.');
        }

        Object.assign(role, rest);

        const targetClientId = client_id || role.client_id || activeClientId;
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
            RolesController: {
                label: 'Perfis e Permissões (Roles)',
                methods: [
                    { name: 'createRoles', label: 'Criar Perfil' },
                    { name: 'getAllRoles', label: 'Listar Perfis' },
                    { name: 'findOne', label: 'Visualizar Perfil' },
                    { name: 'updateRole', label: 'Editar Perfil' },
                    { name: 'removeRole', label: 'Excluir Perfil' },
                ],
            },
            ClientController: {
                label: 'Clientes (Clínicas)',
                methods: [
                    { name: 'create', label: 'Criar Cliente' },
                    { name: 'findAll', label: 'Listar Clientes' },
                    { name: 'findOne', label: 'Visualizar Cliente' },
                    { name: 'update', label: 'Editar Cliente' },
                    { name: 'remove', label: 'Excluir Cliente' },
                ],
            },
        };

        const controllers = this.discoveryService.getControllers();
        const detectedPermissions: Array<{
            controller: string;
            label: string;
            methods: Array<{ name: string; label: string }>;
        }> = [];

        for (const wrapper of controllers) {
            const { instance, metatype } = wrapper;
            if (!instance || !metatype) continue;

            const controllerName = metatype.name;
            const mapped = controllersMap[controllerName];

            if (mapped) {
                detectedPermissions.push({
                    controller: controllerName,
                    label: mapped.label,
                    methods: mapped.methods,
                });
            } else {
                const prototype = Object.getPrototypeOf(instance);
                const methodNames = this.metadataScanner
                    .getAllMethodNames(prototype)
                    .filter((m) => m !== 'constructor');

                if (methodNames.length > 0) {
                    detectedPermissions.push({
                        controller: controllerName,
                        label: controllerName.replace('Controller', ''),
                        methods: methodNames.map((name) => ({
                            name,
                            label: name,
                        })),
                    });
                }
            }
        }

        return detectedPermissions;
    }
}
