import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscoveryModule } from '@nestjs/core';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ClientEntity } from 'src/client/entities/client.entity';
import { RoleEntity } from 'src/roles/entities/role.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CouncilEntity } from 'src/user/entities/council.entity';
import { ProfessionEntity } from 'src/user/entities/profession.entity';
import { SpecialtyEntity } from 'src/user/entities/specialty.entity';

@Module({
  imports: [
    DiscoveryModule,
    TypeOrmModule.forFeature([
      ClientEntity,
      RoleEntity,
      UserEntity,
      CouncilEntity,
      ProfessionEntity,
      SpecialtyEntity,
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
