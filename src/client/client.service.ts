import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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
    console.log(createClientDto);
    if (createClientDto.type === 'FISICA' && createClientDto.cpf) {
      const validateCPF = this.validarCpf.execute(`${createClientDto.cpf}`);
      console.log('validar cpf', validateCPF);
      if (!validateCPF) {
        throw new BadRequestException('CPF invalido');
      }
    } else if (createClientDto.type === 'JURIDICA' && createClientDto.cnpj) {
      const validateCNPJ = this.validarCNPJ.execute(`${createClientDto.cnpj}`);
      console.log('validar cnpj', validateCNPJ)
      if (!validateCNPJ) {
        throw new BadRequestException('CNPJ invalido');
      }
    } else {
      throw new BadRequestException('CPF ou CNPJ devem ser fornecidos');
    }
    return;
    return this.clientRepository.create(createClientDto);
  }

  findAll() {
    return this.clientRepository.getAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
