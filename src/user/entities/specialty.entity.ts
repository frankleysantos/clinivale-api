import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { ProfessionEntity } from "./profession.entity";
import { ProfessionalEntity } from "./professional.entity";

@Entity('specialties')
export class SpecialtyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150, nullable: false })
    name: string; // Ex: Cardiologia, Pediatria, TCC, Fisioterapia Respiratória

    @Column({ name: 'profession_id', type: 'integer', nullable: false })
    profession_id: number;

    @ManyToOne(() => ProfessionEntity, profession => profession.specialties, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'profession_id' })
    profession: ProfessionEntity;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string;

    @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
    status: string;

    @ManyToMany(() => ProfessionalEntity, professional => professional.specialties)
    professionals?: ProfessionalEntity[];

    @Exclude()
    @CreateDateColumn()
    createdAt?: Date;

    @Exclude()
    @UpdateDateColumn()
    updatedAt?: Date;
}
