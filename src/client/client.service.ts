import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientRepository } from './client.repository';
import { CNPJ_VALIDATE, CPF_VALIDATE } from 'src/global/common/constants/general.constant';
import type { CpfOrCNPJ } from 'src/global/common/validator/cpf-or-cnpj.interface';

@Injectable()
export class ClientService {

  constructor(
    private readonly clientRepository: ClientRepository,
    @Inject(CPF_VALIDATE)
    private readonly validarCpf: CpfOrCNPJ,
    @Inject(CNPJ_VALIDATE)
    private readonly validarCNPJ: CpfOrCNPJ,
  ) { }

  create(createClientDto: CreateClientDto) {
    if (createClientDto.type === 'FISICA' && createClientDto.cpf) {
      const validateCPF = this.validarCpf.execute(`${createClientDto.cpf}`);
      if (!validateCPF) {
        throw new BadRequestException('CPF inválido');
      }
    } else if (createClientDto.type === 'JURIDICA' && createClientDto.cnpj) {
      const validateCNPJ = this.validarCNPJ.execute(`${createClientDto.cnpj}`);
      if (!validateCNPJ) {
        throw new BadRequestException('CNPJ inválido');
      }
    } else {
      throw new BadRequestException('CPF ou CNPJ devem ser fornecidos');
    }

    return this.clientRepository.create(createClientDto);
  }

  findAll(client_id?: number, user?: any) {
    const isMasterClinic = user?.client?.name?.toLowerCase() === 'clinivale';
    if (isMasterClinic && !client_id) {
      return this.clientRepository.getAll();
    }
    const targetClientId = client_id || user?.client?.id || user?.clientId || user?.clients?.[0]?.id;
    return this.clientRepository.getAll(targetClientId);
  }

  async findOne(id: number) {
    const client = await this.clientRepository.findOneById(id);
    if (!client) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    await this.findOne(id);
    return this.clientRepository.update(id, updateClientDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.clientRepository.remove(id);
    return { message: 'Cliente removido com sucesso' };
  }
}
