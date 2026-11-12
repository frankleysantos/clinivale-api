import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { ClientEntity } from "src/client/entities/client.entity";
import { PatientEntity } from "src/patient/entities/patient.entity";
import { ProfessionalEntity } from "src/user/entities/professional.entity";
import { MedicalRecordEntity } from "./medical-record.entity";
import { PrescriptionItemEntity } from "./prescription-item.entity";

@Entity('prescriptions')
export class PrescriptionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'client_id', type: 'integer', nullable: false })
    client_id: number;

    @ManyToOne(() => ClientEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: ClientEntity;

    @Column({ name: 'patient_id', type: 'integer', nullable: false })
    patient_id: number;

    @ManyToOne(() => PatientEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'patient_id' })
    patient: PatientEntity;

    @Column({ name: 'professional_id', type: 'integer', nullable: false })
    professional_id: number;

    @ManyToOne(() => ProfessionalEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'professional_id' })
    professional: ProfessionalEntity;

    @Column({ name: 'medical_record_id', type: 'integer', nullable: true })
    medical_record_id?: number | null;

    @ManyToOne(() => MedicalRecordEntity, r => r.prescriptions, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'medical_record_id' })
    medical_record?: MedicalRecordEntity | null;

    // SIMPLES, CONTROLE_ESPECIAL, ANTIMICROBIANO
    @Column({ name: 'prescription_type', type: 'varchar', length: 50, default: 'SIMPLES' })
    prescription_type: string;

    // ATIVA, DISPENSADA, CANCELADA
    @Column({ type: 'varchar', length: 30, default: 'ATIVA' })
    status: string;

    @Column({ name: 'verification_code', type: 'varchar', length: 50, unique: true })
    verification_code: string;

    @Column({ name: 'verification_hash', type: 'varchar', length: 255, nullable: true })
    verification_hash?: string;

    @Column({ type: 'text', nullable: true })
    observations?: string;

    @Column({ name: 'expires_at', type: 'date', nullable: true })
    expires_at?: Date | null;

    @OneToMany(() => PrescriptionItemEntity, item => item.prescription, { cascade: true })
    items: PrescriptionItemEntity[];

    @Exclude()
    @CreateDateColumn()
    createdAt?: Date;

    @Exclude()
    @UpdateDateColumn()
    updatedAt?: Date;
}

