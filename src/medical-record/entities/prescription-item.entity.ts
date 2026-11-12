import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PrescriptionEntity } from "./prescription.entity";

@Entity('prescription_items')
export class PrescriptionItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'prescription_id', type: 'integer', nullable: false })
    prescription_id: number;

    @ManyToOne(() => PrescriptionEntity, p => p.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'prescription_id' })
    prescription: PrescriptionEntity;

    @Column({ name: 'medication_name', type: 'varchar', length: 255 })
    medication_name: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    concentration?: string;

    @Column({ name: 'pharmaceutical_form', type: 'varchar', length: 100, nullable: true })
    pharmaceutical_form?: string;

    @Column({ type: 'text' })
    dosage: string;

    @Column({ type: 'varchar', length: 100 })
    quantity: string;

    @Column({ type: 'varchar', length: 50, default: 'Oral' })
    route: string;

    @Column({ name: 'continuous_use', type: 'boolean', default: false })
    continuous_use: boolean;

    @CreateDateColumn()
    createdAt?: Date;
}

