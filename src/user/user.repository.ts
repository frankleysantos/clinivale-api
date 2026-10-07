import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Brackets, DeepPartial, Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";


export class UserRepository {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

    async created(user: DeepPartial<UserEntity>) {
        return await this.userRepository.save(user);
    }

    getAll(): Promise<UserEntity[]> {
        return this.userRepository.find();
    }

    async getOneWithRoles(user_id: number): Promise<UserEntity | null> {
        return this.userRepository.findOne({
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

        this.userRepository.delete(user_id);
        return 'User deletada';
    }   

    async update(user_id: number, user) {
        let userModel = await this.userRepository.findOneBy({
            id: user_id,
        });

        if (!userModel) {
            throw new NotFoundException('User não encontrada');
        }
        Object.assign(userModel, user);
        return await this.userRepository.save(userModel);   
    }

}