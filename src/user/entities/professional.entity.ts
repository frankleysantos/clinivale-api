import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { ClientEntity } from "src/client/entities/client.entity";
import { ProfessionEntity } from "./profession.entity";
import { CouncilEntity } from "./council.entity";
import { SpecialtyEntity } from "./specialty.entity";
import { Exclude } from "class-transformer";

@Entity('professionals')
export class ProfessionalEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id', type: 'integer', unique: true, nullable: false })
    user_id: number;

    @OneToOne(() => UserEntity, user => user.professional, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ name: 'client_id', type: 'integer', nullable: true })
    client_id?: number | null;

    @ManyToOne(() => ClientEntity, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'client_id' })
    client?: ClientEntity | null;

    // FK para a tabela de Profissões (ex: Médico, Fisioterapeuta, etc.)
    @Column({ name: 'profession_id', type: 'integer', nullable: false })
    profession_id: number;

    @ManyToOne(() => ProfessionEntity, profession => profession.professionals, { onDelete: 'RESTRICT', nullable: false })
    @JoinColumn({ name: 'profession_id' })
    profession: ProfessionEntity;

    @Column({ name: 'council_id', type: 'integer', nullable: true })
    council_id?: number | null;

    @ManyToOne(() => CouncilEntity, council => council.professionals, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'council_id' })
    council?: CouncilEntity | null;

    @Column({ name: 'council_number', type: 'varchar', length: 50, nullable: false })
    council_number: string;

    @Column({ name: 'council_uf', type: 'varchar', length: 2, nullable: false })
    council_uf: string;

    // Vínculo N:N com especialidades através da tabela pivô
    @ManyToMany(() => SpecialtyEntity, specialty => specialty.professionals, { cascade: false })
    @JoinTable({
        name: 'professional_specialties',
        joinColumn: { name: 'professional_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'specialty_id', referencedColumnName: 'id' }
    })
    specialties?: SpecialtyEntity[];

    @Exclude()
    @CreateDateColumn()
    createdAt?: Date;

    @Exclude()
    @UpdateDateColumn()
    updatedAt?: Date;
}
