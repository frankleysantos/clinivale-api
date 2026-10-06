import { Exclude } from "class-transformer";
import { PatientEntity } from "src/patient/entities/patient.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('clients')
export class ClientEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: true,
        transformer: {
            to: (value: string) => value?.replace(/[^\d]/g, '') || null,
            from: (value: string) => value?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        } 
    })
    cpf: string;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: true,
        transformer: {
            to: (value: string) => value?.replace(/[^\d]/g, '') || null,
            from: (value: string) => value?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
        }
    })
    cnpj: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    cellphone: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    city: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    state: string;

    @Column({ type: 'enum', enum: ['FISICA', 'JURIDICA'], default: 'FISICA'})
    type: string

    @Column({ type: 'enum', enum: ['ATIVO', 'INATIVO'], default: 'ATIVO' })
    status: string;

    @Exclude()
    @OneToMany(() => PatientEntity, patient => patient.client)
    patients: PatientEntity[]

    @ManyToMany(() => UserEntity, user => user.clients)
    users: UserEntity[];
    
}
