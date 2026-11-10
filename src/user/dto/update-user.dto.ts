import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEmailUnique } from './validators/is-email-unique.decorator';

// Omitimos o email do CreateUserDto para permitir sobrescrever com validação ciente do id na atualização
export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['email'] as const)) {
    @ApiPropertyOptional({ example: 1, description: 'ID do usuário sendo editado (permite manter o mesmo e-mail)' })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;

    @ApiPropertyOptional({ example: 'maria@clinivale.com', description: 'E-mail do usuário' })
    @IsOptional()
    @IsEmail({}, { message: 'E-mail inválido' })
    @IsEmailUnique({ message: 'O email já está em uso' })
    email?: string;
}
