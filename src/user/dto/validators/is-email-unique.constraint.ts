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

  async validate(email: string) {
   
    const exists = await this.userRepository.getOne(0, email);
    return !exists;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} já cadastrado`;
  }
}