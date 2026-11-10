import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProfessionalAuxController } from './professional-aux.controller';
import { CouncilEntity } from '../entities/council.entity';
import { ProfessionEntity } from '../entities/profession.entity';
import { SpecialtyEntity } from '../entities/specialty.entity';

describe('ProfessionalAuxController', () => {
  let controller: ProfessionalAuxController;

  const mockCouncilRepository = {
    find: jest.fn(),
  };

  const mockProfessionRepository = {
    find: jest.fn(),
  };

  const mockSpecialtyRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessionalAuxController],
      providers: [
        {
          provide: getRepositoryToken(CouncilEntity),
          useValue: mockCouncilRepository,
        },
        {
          provide: getRepositoryToken(ProfessionEntity),
          useValue: mockProfessionRepository,
        },
        {
          provide: getRepositoryToken(SpecialtyEntity),
          useValue: mockSpecialtyRepository,
        },
      ],
    }).compile();

    controller = module.get<ProfessionalAuxController>(ProfessionalAuxController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('getCouncils', () => {
    it('deve listar todos os conselhos ativos ordenados por código', async () => {
      const mockCouncils = [
        { id: 1, code: 'CRM', name: 'Conselho Regional de Medicina', status: 'ACTIVE' },
        { id: 2, code: 'CRO', name: 'Conselho Regional de Odontologia', status: 'ACTIVE' },
      ];
      mockCouncilRepository.find.mockResolvedValue(mockCouncils);

      const result = await controller.getCouncils();

      expect(mockCouncilRepository.find).toHaveBeenCalledWith({
        where: { status: 'ACTIVE' },
        order: { code: 'ASC' },
      });
      expect(result).toEqual(mockCouncils);
    });
  });

  describe('getProfessions', () => {
    it('deve listar todas as profissões ativas com a relação de conselho', async () => {
      const mockProfessions = [
        { id: 1, name: 'Médico', council: { code: 'CRM' }, status: 'ACTIVE' },
        { id: 2, name: 'Psicólogo', council: { code: 'CRP' }, status: 'ACTIVE' },
      ];
      mockProfessionRepository.find.mockResolvedValue(mockProfessions);

      const result = await controller.getProfessions();

      expect(mockProfessionRepository.find).toHaveBeenCalledWith({
        where: { status: 'ACTIVE' },
        relations: ['council'],
        order: { name: 'ASC' },
      });
      expect(result).toEqual(mockProfessions);
    });
  });

  describe('getSpecialties', () => {
    it('deve filtrar especialidades por profession_id quando informado', async () => {
      const mockSpecialties = [
        { id: 1, name: 'Cardiologia', profession_id: 1, status: 'ACTIVE' },
        { id: 2, name: 'Dermatologia', profession_id: 1, status: 'ACTIVE' },
      ];
      mockSpecialtyRepository.find.mockResolvedValue(mockSpecialties);

      const result = await controller.getSpecialties(1);

      expect(mockSpecialtyRepository.find).toHaveBeenCalledWith({
        where: { profession_id: 1, status: 'ACTIVE' },
        order: { name: 'ASC' },
      });
      expect(result).toEqual(mockSpecialties);
    });

    it('deve retornar todas as especialidades ativas com a relação de profissão quando profession_id não for informado', async () => {
      const mockSpecialties = [
        { id: 1, name: 'Cardiologia', profession: { name: 'Médico' }, status: 'ACTIVE' },
        { id: 3, name: 'Psicologia Clínica', profession: { name: 'Psicólogo' }, status: 'ACTIVE' },
      ];
      mockSpecialtyRepository.find.mockResolvedValue(mockSpecialties);

      const result = await controller.getSpecialties();

      expect(mockSpecialtyRepository.find).toHaveBeenCalledWith({
        where: { status: 'ACTIVE' },
        relations: ['profession'],
        order: { name: 'ASC' },
      });
      expect(result).toEqual(mockSpecialties);
    });
  });
});

