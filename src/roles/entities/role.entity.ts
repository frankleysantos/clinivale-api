import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  // Ex: [{ controller: 'ProntuarioController', method: 'create' }]
  @Column({ type: 'json', default: [] })
  permissions: { controller: string; method: string }[];

  @ManyToMany(() => UserEntity, user => user.roles)
  users: UserEntity[];

}