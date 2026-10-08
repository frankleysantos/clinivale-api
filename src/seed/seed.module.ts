import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscoveryModule } from '@nestjs/core';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ClientEntity } from 'src/client/entities/client.entity';
import { RoleEntity } from 'src/roles/entities/role.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [
    DiscoveryModule,
    TypeOrmModule.forFeature([ClientEntity, RoleEntity, UserEntity]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
