import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { ProfessionalEntity } from "./entities/professional.entity";
import { SpecialtyEntity } from "./entities/specialty.entity";
import { RoleEntity } from "src/roles/entities/role.entity";
import { Brackets, DeepPartial, In, Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";

export class UserRepository {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(ProfessionalEntity) private readonly professionalRepository: Repository<ProfessionalEntity>,
        @InjectRepository(SpecialtyEntity) private readonly specialtyRepository: Repository<SpecialtyEntity>,
    ) {}

    async created(user: DeepPartial<UserEntity>, roleIds?: number[], professionalData?: any) {
        if (roleIds && roleIds.length > 0) {
            const roles = await this.userRepository.manager.getRepository(RoleEntity).findBy({
                id: In(roleIds),
            });
            user.roles = roles;
        }

        const savedUser = await this.userRepository.save(user);

        if (professionalData) {
            const clientId = user.clients?.[0]?.id;
            const { specialty_ids, ...profFields } = professionalData;

            let specialties: SpecialtyEntity[] = [];
            if (Array.isArray(specialty_ids) && specialty_ids.length > 0) {
                specialties = await this.specialtyRepository.findBy({ id: In(specialty_ids) });
            }

            const professional = this.professionalRepository.create({
                ...profFields,
                user_id: savedUser.id,
                client_id: clientId,
                specialties,
            });
            await this.professionalRepository.save(professional);
            savedUser.professional = professional;
        }

        return savedUser;
    }

    async getAll(client_id?: number): Promise<UserEntity[]> {
        let users: UserEntity[];
        const relations = [
            'clients',
            'roles',
            'professional',
            'professional.profession',
            'professional.council',
            'professional.specialties'
        ];

        if (client_id) {
            users = await this.userRepository.find({
                where: {
                    clients: {
                        id: client_id,
                    },
                },
                relations,
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
                relations,
            });
        }
        return users;
    }

    async getOneWithRoles(user_id: number, client_id?: number): Promise<UserEntity | null> {
        const user = await this.userRepository.findOne({
            where: { id: user_id },
            relations: [
                'roles',
                'clients',
                'professional',
                'professional.profession',
                'professional.council',
                'professional.specialties'
            ],
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
                professional: {
                    id: true,
                    user_id: true,
                    client_id: true,
                    profession_id: true,
                    council_id: true,
                    council_number: true,
                    council_uf: true,
                    profession: {
                        id: true,
                        name: true,
                    },
                    council: {
                        id: true,
                        code: true,
                        name: true,
                    },
                    specialties: {
                        id: true,
                        name: true,
                    },
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
                                .leftJoinAndSelect('users.professional', 'professional')
                                .leftJoinAndSelect('professional.profession', 'profession')
                                .leftJoinAndSelect('professional.council', 'council')
                                .leftJoinAndSelect('professional.specialties', 'specialties')
                                .select([
                                    'users.id',
                                    'users.name',
                                    'users.email',
                                    'users.password',
                                    'professional.id',
                                    'professional.profession_id',
                                    'professional.council_id',
                                    'professional.council_number',
                                    'professional.council_uf',
                                    'profession.id',
                                    'profession.name',
                                    'council.id',
                                    'council.code',
                                    'council.name',
                                    'specialties.id',
                                    'specialties.name',
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
            relations: ['roles', 'clients', 'professional', 'professional.specialties'],
        });

        if (!userModel) {
            throw new NotFoundException('User não encontrada');
        }

        const { role_ids, is_health_professional, professional, ...rest } = user;
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

        // Atualização dos dados de profissional de saúde
        if (is_health_professional === false) {
            if (userModel.professional) {
                await this.professionalRepository.delete({ user_id });
                userModel.professional = undefined;
            }
        } else if (professional) {
            const targetClientId = clientId || userModel.clients?.[0]?.id;
            const { specialty_ids, ...profFields } = professional;

            let specialties: SpecialtyEntity[] | undefined = undefined;
            if (specialty_ids !== undefined && Array.isArray(specialty_ids)) {
                specialties = specialty_ids.length > 0
                    ? await this.specialtyRepository.findBy({ id: In(specialty_ids) })
                    : [];
            }

            if (userModel.professional) {
                Object.assign(userModel.professional, profFields);
                if (specialties !== undefined) {
                    userModel.professional.specialties = specialties;
                }
                await this.professionalRepository.save(userModel.professional);
            } else {
                const newProf = this.professionalRepository.create({
                    ...profFields,
                    user_id,
                    client_id: targetClientId,
                    ...(specialties ? { specialties } : {}),
                });
                await this.professionalRepository.save(newProf);
                userModel.professional = newProf;
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
