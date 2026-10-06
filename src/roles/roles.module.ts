import { forwardRef, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { UserModule } from 'src/user/user.module';
import { JwtGuard } from 'src/auth/guards/auth.guard';

@Module({
  imports: [
    DiscoveryModule,
    TypeOrmModule.forFeature([RoleEntity]),
    forwardRef(() => UserModule),
  ],
  exports: [TypeOrmModule],
  controllers: [RolesController],
  providers: [RolesService, JwtGuard],
})
export class RolesModule {}
