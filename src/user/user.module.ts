import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProfessionalAuxController } from './controllers/professional-aux.controller';
import { UserEntity } from './entities/user.entity';
import { ProfessionalEntity } from './entities/professional.entity';
import { ProfessionEntity } from './entities/profession.entity';
import { CouncilEntity } from './entities/council.entity';
import { SpecialtyEntity } from './entities/specialty.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { IsEmailUniqueConstraint } from './dto/validators/is-email-unique.constraint';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ProfessionalEntity,
      ProfessionEntity,
      CouncilEntity,
      SpecialtyEntity,
    ]),
    forwardRef(() => RolesModule),
  ],
  controllers: [UserController, ProfessionalAuxController],
  providers: [UserService, UserRepository, IsEmailUniqueConstraint],
  exports: [UserRepository, TypeOrmModule]
})
export class UserModule { }
