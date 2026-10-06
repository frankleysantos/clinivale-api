import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from './entities/patient.entity';
import { PatientRepository } from './patient.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PatientController],
  providers: [PatientService, PatientRepository],
  imports: [TypeOrmModule.forFeature([PatientEntity]), AuthModule]
})
export class PatientModule { }
