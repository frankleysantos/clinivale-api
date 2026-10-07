import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientRepository } from './patient.repository';
import { DeepPartial } from 'typeorm';
import { PatientEntity } from './entities/patient.entity';
import { ClientEntity } from 'src/client/entities/client.entity';
import type { CpfOrCNPJ } from 'src/global/common/validator/cpf-or-cnpj.interface';
import { CPF_VALIDATE } from 'src/global/common/constants/general.constant';

@Injectable()
export class PatientService {
  constructor(
    private readonly patientRepository: PatientRepository,
    @Inject(CPF_VALIDATE)
    private readonly validateCpf: CpfOrCNPJ
  ) { }

  async create(patient: CreatePatientDto, user?: any) {
    const { client_id, ...rest } = patient;
    if (patient.cpf) {
      const validate = this.validateCpf.execute(patient.cpf);
      if (!validate) {
        throw new BadRequestException('CPF inválido');
      }
    }
    console.log('usuario', user)
    const targetClientId = client_id ? Number(client_id) : user?.client?.id || user?.clientId || user?.clients?.[0]?.id;
    const clientEntities: DeepPartial<ClientEntity>[] = targetClientId ? [{ id: targetClientId }] : [];

    const data: DeepPartial<PatientEntity> = {
      ...rest,
      clients: clientEntities,
    };

    return this.patientRepository.create(data);
  }

  findAll(client_id?: number, user?: any) {
    const targetClientId = client_id ? Number(client_id) : user?.client?.id || user?.clientId || user?.clients?.[0]?.id;
    return this.patientRepository.findAll(targetClientId);
  }

  async findOne(id: number) {
    const patient = await this.patientRepository.findOneById(id);
    if (!patient) {
      throw new NotFoundException(`Paciente com ID ${id} não encontrado`);
    }
    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    await this.findOne(id);

    if (updatePatientDto.cpf) {
      const validate = this.validateCpf.execute(updatePatientDto.cpf);
      if (!validate) {
        throw new BadRequestException('CPF inválido');
      }
    }

    const { client_id, ...rest } = updatePatientDto;
    const data: DeepPartial<PatientEntity> = {
      ...rest,
      ...(client_id ? { clients: [{ id: client_id }] } : {}),
    };

    return this.patientRepository.update(id, data);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.patientRepository.remove(id);
    return { message: 'Paciente removido com sucesso' };
  }
}
