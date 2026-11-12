import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { ClientEntity } from "src/client/entities/client.entity";
import { PatientEntity } from "src/patient/entities/patient.entity";
import { ProfessionalEntity } from "src/user/entities/professional.entity";
import { PrescriptionEntity } from "./prescription.entity";
import { MedicalCertificateEntity } from "./medical-certificate.entity";

@Entity('medical_records')
export class MedicalRecordEntity {
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

    // CONSULTA, RETORNO, URGENCIA, TELECONSULTA
    @Column({ name: 'record_type', type: 'varchar', length: 50, default: 'CONSULTA' })
    record_type: string;

    // EM_ANDAMENTO, FINALIZADO, CANCELADO
    @Column({ type: 'varchar', length: 30, default: 'EM_ANDAMENTO' })
    status: string;

    // Subjetivo
    @Column({ name: 'chief_complaint', type: 'text', nullable: true })
    chief_complaint?: string;

    @Column({ type: 'text', nullable: true })
    hda?: string;

    @Column({ name: 'past_history', type: 'text', nullable: true })
    past_history?: string;

    @Column({ name: 'family_history', type: 'text', nullable: true })
    family_history?: string;

    // Objetivo
    @Column({ name: 'physical_exam', type: 'text', nullable: true })
    physical_exam?: string;

    @Column({ name: 'vital_signs', type: 'json', nullable: true })
    vital_signs?: {
        systolic_bp?: number;
        diastolic_bp?: number;
        heart_rate?: number;
        respiratory_rate?: number;
        temperature?: number;
        spo2?: number;
        weight?: number;
        height?: number;
        bmi?: number;
    } | null;

    // Avaliação
    @Column({ name: 'diagnostic_hypothesis', type: 'text', nullable: true })
    diagnostic_hypothesis?: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    cid10?: string;

    // Plano / Conduta
    @Column({ name: 'clinical_conduct', type: 'text', nullable: true })
    clinical_conduct?: string;

    @Column({ name: 'started_at', type: 'datetime' })
    started_at: Date;

    @Column({ name: 'finished_at', type: 'datetime', nullable: true })
    finished_at?: Date | null;

    @OneToMany(() => PrescriptionEntity, p => p.medical_record)
    prescriptions?: PrescriptionEntity[];

    @OneToMany(() => MedicalCertificateEntity, c => c.medical_record)
    certificates?: MedicalCertificateEntity[];

    @Exclude()
    @CreateDateColumn()
    createdAt?: Date;

    @Exclude()
    @UpdateDateColumn()
    updatedAt?: Date;
}

