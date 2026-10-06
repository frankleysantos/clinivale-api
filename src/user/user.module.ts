import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { IsEmailUniqueConstraint } from './dto/validators/is-email-unique.constraint';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => RolesModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, IsEmailUniqueConstraint],
  exports: [UserRepository]
})
export class UserModule {}
