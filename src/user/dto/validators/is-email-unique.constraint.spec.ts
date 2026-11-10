import { Test, TestingModule } from '@nestjs/testing';
import { IsEmailUniqueConstraint } from './is-email-unique.constraint';
import { UserRepository } from 'src/user/user.repository';
import { ValidationArguments } from 'class-validator';

describe('IsEmailUniqueConstraint', () => {
  let constraint: IsEmailUniqueConstraint;

  const mockUserRepository = {
    getOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsEmailUniqueConstraint,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    constraint = module.get<IsEmailUniqueConstraint>(IsEmailUniqueConstraint);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve permitir quando email não for informado', async () => {
    const result = await constraint.validate('');
    expect(result).toBe(true);
  });

  it('deve permitir quando nenhum usuário com o mesmo email for encontrado', async () => {
    mockUserRepository.getOne.mockResolvedValue(null);

    const result = await constraint.validate('novo@email.com');
    expect(result).toBe(true);
    expect(mockUserRepository.getOne).toHaveBeenCalledWith(0, 'novo@email.com');
  });

  it('deve rejeitar na criação quando já existir um usuário com o mesmo email', async () => {
    mockUserRepository.getOne.mockResolvedValue({ id: 5, email: 'existente@email.com' });

    const result = await constraint.validate('existente@email.com');
    expect(result).toBe(false);
  });

  it('deve permitir na edição se o email pertencer ao próprio usuário sendo editado', async () => {
    mockUserRepository.getOne.mockResolvedValue({ id: 2, email: 'isac@noah.com' });

    const args: ValidationArguments = {
      value: 'isac@noah.com',
      targetName: 'UpdateUserDto',
      object: { id: 2, name: 'isac' },
      property: 'email',
      constraints: [],
    };

    const result = await constraint.validate('isac@noah.com', args);
    expect(result).toBe(true);
  });

  it('deve rejeitar na edição se o email pertencer a outro usuário', async () => {
    mockUserRepository.getOne.mockResolvedValue({ id: 10, email: 'outro@email.com' });

    const args: ValidationArguments = {
      value: 'outro@email.com',
      targetName: 'UpdateUserDto',
      object: { id: 2, name: 'isac' },
      property: 'email',
      constraints: [],
    };

    const result = await constraint.validate('outro@email.com', args);
    expect(result).toBe(false);
  });
});

