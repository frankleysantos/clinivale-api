import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { ProfessionEntity } from "./profession.entity";
import { ProfessionalEntity } from "./professional.entity";

@Entity('councils')
export class CouncilEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
    code: string; // Ex: CRM, CRO, CRP, COREN, CREFITO, CRN, etc.

    @Column({ type: 'varchar', length: 150, nullable: false })
    name: string; // Ex: Conselho Regional de Medicina

    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string;

    @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
    status: string;

    @OneToMany(() => ProfessionEntity, profession => profession.council)
    professions?: ProfessionEntity[];

    @OneToMany(() => ProfessionalEntity, professional => professional.council)
    professionals?: ProfessionalEntity[];

    @Exclude()
    @CreateDateColumn()
    createdAt?: Date;

    @Exclude()
    @UpdateDateColumn()
    updatedAt?: Date;
}
