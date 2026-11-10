import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { CouncilEntity } from "./council.entity";
import { SpecialtyEntity } from "./specialty.entity";
import { ProfessionalEntity } from "./professional.entity";

@Entity('professions')
export class ProfessionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
    name: string; // Ex: Médico, Fisioterapeuta, Psicólogo, Cirurgião-Dentista, Nutricionista, etc.

    @Column({ name: 'council_id', type: 'integer', nullable: true })
    council_id?: number | null;

    @ManyToOne(() => CouncilEntity, council => council.professions, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'council_id' })
    council?: CouncilEntity | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string;

    @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
    status: string;

    @OneToMany(() => SpecialtyEntity, specialty => specialty.profession)
    specialties?: SpecialtyEntity[];

    @OneToMany(() => ProfessionalEntity, professional => professional.profession)
    professionals?: ProfessionalEntity[];

    @Exclude()
    @CreateDateColumn()
    createdAt?: Date;

    @Exclude()
    @UpdateDateColumn()
    updatedAt?: Date;
}

