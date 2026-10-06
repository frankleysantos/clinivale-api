import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientRepository } from './patient.repository';
import { DeepPartial } from 'typeorm';
import { PatientEntity } from './entities/patient.entity';
import type { CpfOrCNPJ } from 'src/global/common/validator/cpf-or-cnpj.interface';
import { CPF_VALIDATE } from 'src/global/common/constants/general.constant';

@Injectable()
export class PatientService {
  constructor(
    private readonly patientRepository: PatientRepository,
    @Inject(CPF_VALIDATE)
    private readonly validateCpf: CpfOrCNPJ
  ) {}


create(patient: CreatePatientDto) {
    const { client_id, ...rest } = patient;
    console.log('patient', patient)
    if (patient.cpf) {
      const validate = this.validateCpf.execute(patient.cpf);
      if (!validate) {
        throw new BadRequestException('CPF invalido');
      }
    }
    const data: DeepPartial<PatientEntity> = {
        ...rest,
        client: {
            id: client_id
        }
    };

    return this.patientRepository.create(data);
}

  findAll() {
    return this.patientRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} patient`;
  }

  update(id: number, updatePatientDto: UpdatePatientDto) {
    const data: DeepPartial<PatientEntity> = {
      ...updatePatientDto
    }
    return this.patientRepository.update(id, data);
  }

  remove(id: number) {
    return `This action removes a #${id} patient`;
  }
}
