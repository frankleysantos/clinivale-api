import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailUniqueConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly userRepository: UserRepository) {}

  async validate(email: string, args?: ValidationArguments) {
    if (!email) return true;

    const exists = await this.userRepository.getOne(0, email);
    if (!exists) return true;

    // Se estiver em contexto de atualização e tiver o ID do usuário sendo editado
    const obj = args?.object as any;
    const editingUserId = obj?.id || obj?.user_id;

    if (editingUserId && Number(exists.id) === Number(editingUserId)) {
      return true; // É o próprio usuário mantendo seu e-mail
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} já cadastrado`;
  }
}
