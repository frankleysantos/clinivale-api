import {
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { IsEmailUniqueConstraint } from './is-email-unique.constraint';

export function IsEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsEmailUniqueConstraint,
    });
  };
}