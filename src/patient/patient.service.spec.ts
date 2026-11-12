import { Test, TestingModule } from '@nestjs/testing';
import { PatientService } from './patient.service';
import { PatientRepository } from './patient.repository';
import { CPF_VALIDATE } from 'src/global/common/constants/general.constant';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';

describe('PatientService', () => {
  let service: PatientService;

  const mockPatientRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockValidateCpf = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientService,
        {
          provide: PatientRepository,
          useValue: mockPatientRepository,
        },
        {
          provide: CPF_VALIDATE,
          useValue: mockValidateCpf,
        },
      ],
    }).compile();

    service = module.get<PatientService>(PatientService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const validDto: CreatePatientDto = {
      name: 'João da Silva',
      social_name: 'Joãozinho',
      cpf: '52998224725',
      rg: '123456789',
      rg_issuer: 'SSP',
      rg_state: 'SP',
      cns: '700000000000001',
      birthDate: new Date('1990-05-15'),
      gender: 'M',
      race: 'PARDA',
      mother_name: 'Maria da Silva',
      father_name: 'José da Silva',
      cellphone: '11988887777',
      email: 'joao.silva@email.com',
      postal_code: '01310100',
      address: 'Avenida Paulista',
      address_number: '1000',
      address_complement: 'Apto 42',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      occupation: 'Engenheiro',
    };

    it('deve criar um paciente com todos os campos SBIS obrigatórios e opcionais incluindo raça e RG', async () => {
      mockValidateCpf.execute.mockReturnValue(true);
      mockPatientRepository.create.mockResolvedValue({ id: 1, ...validDto });

      const user = { client: { id: 1 } };
      const result = await service.create(validDto, user);

      expect(mockValidateCpf.execute).toHaveBeenCalledWith(validDto.cpf);
      expect(mockPatientRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        name: validDto.name,
        gender: 'M',
        race: 'PARDA',
        mother_name: 'Maria da Silva',
        father_name: 'José da Silva',
        rg: '123456789',
        cpf: validDto.cpf,
        clients: [{ id: 1 }],
      }));
      expect(result).toHaveProperty('id', 1);
    });

    it('deve permitir criar paciente sem CPF (recém-nascidos / menores)', async () => {
      const dtoSemCpf = { ...validDto, cpf: undefined };
      mockPatientRepository.create.mockResolvedValue({ id: 2, ...dtoSemCpf });

      const result = await service.create(dtoSemCpf);
      expect(mockValidateCpf.execute).not.toHaveBeenCalled();
      expect(mockPatientRepository.create).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 2);
    });

    it('deve lançar BadRequestException se o CPF for informado e for inválido', async () => {
      mockValidateCpf.execute.mockReturnValue(false);

      await expect(service.create(validDto)).rejects.toThrow(BadRequestException);
      expect(mockPatientRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar o paciente encontrado com dados completos', async () => {
      const mockPatient = { id: 1, name: 'João da Silva', gender: 'M', race: 'PARDA', mother_name: 'Maria' };
      mockPatientRepository.findOneById.mockResolvedValue(mockPatient);

      const result = await service.findOne(1);
      expect(result).toEqual(mockPatient);
    });

    it('deve lançar NotFoundException se o paciente não existir', async () => {
      mockPatientRepository.findOneById.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
