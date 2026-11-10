import { RoleEntity } from "src/roles/entities/role.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ClientEntity } from "src/client/entities/client.entity";
import { ProfessionalEntity } from "./professional.entity";
import { Exclude } from "class-transformer";

@Entity('users')
export class UserEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Exclude()
    @Column({ type: 'varchar', length: 255, nullable: false })
    password: string;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    email: string;

    @ManyToMany(() => RoleEntity, role => role.users, { eager: false })
    @JoinTable({ name: 'user_roles' })
    roles: RoleEntity[];

    @Exclude()
    @CreateDateColumn()
    createdAt?: Date;

    @Exclude()
    @UpdateDateColumn()
    updatedAt?: Date;

    @ManyToMany(() => ClientEntity, client => client.users, { eager: false })
    @JoinTable({ name: 'user_clients' })
    clients: ClientEntity[];

    @OneToOne(() => ProfessionalEntity, professional => professional.user, { cascade: true })
    professional?: ProfessionalEntity;
}
