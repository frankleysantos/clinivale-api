import { ClientEntity } from "src/client/entities/client.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";

@Entity('patients')
export class PatientEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ name: 'social_name', type: 'varchar', length: 255, nullable: true })
    social_name?: string;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
    cpf?: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    cns?: string;

    @Column({ type: 'date' })
    birthDate: Date;

    // 'M' | 'F' | 'I' (Masculino, Feminino, Indeterminado / Não Informado)
    @Column({ type: 'varchar', length: 20 })
    gender: string;

    @Column({ name: 'mother_name', type: 'varchar', length: 255 })
    mother_name: string;

    @Column({ name: 'father_name', type: 'varchar', length: 255, nullable: true })
    father_name?: string;

    @Column({ type: 'varchar', length: 255 })
    cellphone: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email: string;

    @Column({ name: 'postal_code', type: 'varchar', length: 20, nullable: true })
    postal_code?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    address: string;

    @Column({ name: 'address_number', type: 'varchar', length: 50, nullable: true })
    address_number?: string;

    @Column({ name: 'address_complement', type: 'varchar', length: 100, nullable: true })
    address_complement?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    neighborhood: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    city: string;

    @Column({ type: 'varchar', length: 2, nullable: true })
    state: string;

    @Column({ type: 'varchar', length: 255, nullable: true, default: 'Brasil' })
    country: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    occupation: string;

    @Exclude()
    @CreateDateColumn()
    createdAt?: Date;

    @Exclude()
    @UpdateDateColumn()
    updatedAt?: Date;

    @ManyToMany(() => ClientEntity, client => client.patients, { eager: false })
    @JoinTable({
        name: 'client_patients',
        joinColumn: { name: 'patient_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'client_id', referencedColumnName: 'id' },
    })
    clients: ClientEntity[];
}
