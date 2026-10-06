import { ClientEntity } from "src/client/entities/client.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('patients')
export class PatientEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    cpf: string;

    @Column({ type: 'date' })
    birthDate: Date;

    @Column({ type: 'varchar', length: 255 })
    cellphone: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    address: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    neighborhood: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    city: string;

    @Column({ type: 'varchar', length: 255, nullable: true})
    state: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    country: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    occupation: string;

    // @Column() 
    // client_id: number;

    @ManyToOne(() => ClientEntity, client => client.patients)
    @JoinColumn({ name: 'client_id' })
    client: ClientEntity;
}
