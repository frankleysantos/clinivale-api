import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiPropertyOptional({ example: 1, description: 'ID do usuário sendo editado (permite manter o mesmo e-mail)' })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;
}
