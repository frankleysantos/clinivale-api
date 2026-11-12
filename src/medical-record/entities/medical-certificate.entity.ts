import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { ClientEntity } from "src/client/entities/client.entity";
import { PatientEntity } from "src/patient/entities/patient.entity";
import { ProfessionalEntity } from "src/user/entities/professional.entity";
import { MedicalRecordEntity } from "./medical-record.entity";

@Entity('medical_certificates')
export class MedicalCertificateEntity {
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

    @ManyToOne(() => MedicalRecordEntity, r => r.certificates, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'medical_record_id' })
    medical_record?: MedicalRecordEntity | null;

    // REPOUSO_MEDICO, COMPARECIMENTO, APTIDAO_FISICA, ACOMPANHANTE
    @Column({ name: 'certificate_type', type: 'varchar', length: 50, default: 'REPOUSO_MEDICO' })
    certificate_type: string;

    @Column({ name: 'days_off', type: 'integer', nullable: true })
    days_off?: number | null;

    @Column({ name: 'days_off_text', type: 'varchar', length: 100, nullable: true })
    days_off_text?: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    cid10?: string | null;

    // Consentimento mandatório do paciente segundo Resoluções CFM 1.658/2002 e 1.851/2008
    @Column({ name: 'cid_authorized_by_patient', type: 'boolean', default: false })
    cid_authorized_by_patient: boolean;

    @Column({ type: 'text' })
    description: string;

    @Column({ name: 'verification_code', type: 'varchar', length: 50, unique: true })
    verification_code: string;

    @Exclude()
    @CreateDateColumn()
    createdAt?: Date;

    @Exclude()
    @UpdateDateColumn()
    updatedAt?: Date;
}

