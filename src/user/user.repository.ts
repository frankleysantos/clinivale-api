import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { RoleEntity } from "src/roles/entities/role.entity";
import { Brackets, DeepPartial, In, Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";


export class UserRepository {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

    async created(user: DeepPartial<UserEntity>, roleIds?: number[]) {
        if (roleIds && roleIds.length > 0) {
            const roles = await this.userRepository.manager.getRepository(RoleEntity).findBy({
                id: In(roleIds),
            });
            user.roles = roles;
        }
        return await this.userRepository.save(user);
    }

    async getAll(client_id?: number): Promise<UserEntity[]> {
        let users: UserEntity[];
        if (client_id) {
            users = await this.userRepository.find({
                where: {
                    clients: {
                        id: client_id,
                    },
                },
                relations: ['clients', 'roles'],
            });

            const targetId = Number(client_id);
            users.forEach((user) => {
                if (user.roles) {
                    user.roles = user.roles.filter(
                        (role) => (role.client_id != null && Number(role.client_id) === targetId) || role.client_id == null,
                    );
                }
            });
        } else {
            users = await this.userRepository.find({
                relations: ['clients', 'roles'],
            });
        }
        return users;
    }

    async getOneWithRoles(user_id: number, client_id?: number): Promise<UserEntity | null> {
        const user = await this.userRepository.findOne({
            where: { id: user_id },
            relations: ['roles', 'clients'],
            select: {
                id: true,
                name: true,
                email: true,

                roles: {
                    id: true,
                    name: true,
                    permissions: true,
                    client_id: true,
                },
                clients: {
                    id: true,
                    name: true,
                },
            },
        });

        if (user && client_id) {
            const targetId = Number(client_id);
            if (user.roles) {
                user.roles = user.roles.filter(
                    (role) => (role.client_id != null && Number(role.client_id) === targetId) || role.client_id == null,
                );
            }
        }

        return user;
    }

    async getOne(user_id: number, email: string): Promise<UserEntity | null> {
        const user = await this.userRepository.createQueryBuilder('users')
                                .select([
                                    'users.id',
                                    'users.name',
                                    'users.email',
                                    'users.password',
                                ])
                                .where(
                                    new Brackets(qr => {
                                        qr.where('users.id = :user_id', { user_id })
                                        .orWhere('users.email = :email', { email })
                                    })
                                )
                                .getOne();
   
        return user;
    }

    async delete(user_id: number) {
        let userModel = await this.userRepository.findOneBy({
            id: user_id,
        });

        if (!userModel) {
            throw new NotFoundException('User não encontrada');
        }

        await this.userRepository.delete(user_id);
        return 'User deletada';
    }   

    async update(user_id: number, user: any, clientId?: number) {
        let userModel = await this.userRepository.findOne({
            where: { id: user_id },
            relations: ['roles', 'clients'],
        });

        if (!userModel) {
            throw new NotFoundException('User não encontrada');
        }

        const { role_ids, ...rest } = user;
        Object.assign(userModel, rest);

        if (role_ids !== undefined) {
            let newRoles: RoleEntity[] = [];
            if (Array.isArray(role_ids) && role_ids.length > 0) {
                newRoles = await this.userRepository.manager.getRepository(RoleEntity).findBy({
                    id: In(role_ids),
                });
            }

            if (clientId) {
                const targetId = Number(clientId);
                const otherClientRoles = (userModel.roles || []).filter(
                    (role) => role.client_id != null && Number(role.client_id) !== targetId,
                );
                userModel.roles = [...otherClientRoles, ...newRoles];
            } else {
                userModel.roles = newRoles;
            }
        }

        const savedUser = await this.userRepository.save(userModel);
        if (clientId && savedUser.roles) {
            const targetId = Number(clientId);
            savedUser.roles = savedUser.roles.filter(
                (role) => (role.client_id != null && Number(role.client_id) === targetId) || role.client_id == null,
            );
        }

        return savedUser;
    }

}