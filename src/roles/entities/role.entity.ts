import { ClientEntity } from 'src/client/entities/client.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  // Ex: [{ controller: 'ProntuarioController', method: 'create' }]
  @Column({ type: 'json', default: [] })
  permissions: { controller: string; method: string }[];

  @Column({ name: 'client_id', type: 'integer', nullable: true })
  client_id?: number | null;

  @ManyToOne(() => ClientEntity, client => client.roles, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'client_id' })
  client?: ClientEntity | null;

  @ManyToMany(() => UserEntity, user => user.roles)
  users: UserEntity[];
}