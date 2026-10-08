import { IsArray, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { IsEmailUnique } from "./validators/is-email-unique.decorator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: 'Maria Souza', description: 'Nome do usuário' })
    @IsNotEmpty({ message: 'O name é obrigatório' })
    name: string;

    @ApiProperty({ example: '123456', description: 'Senha do usuário' })
    @IsNotEmpty({ message: 'A password é obrigatória' })
    password: string;

    @ApiProperty({ example: 'maria@clinivale.com', description: 'E-mail do usuário' })
    @IsEmailUnique({ message: 'O email já está em uso' })
    @IsNotEmpty({ message: 'O email é obrigatório' })
    email: string;

    @ApiPropertyOptional({ example: 1, description: 'ID do cliente a ser associado (opcional)' })
    @IsOptional()
    @IsInt({ message: 'O ID do cliente deve ser um número inteiro' })
    @Type(() => Number)
    client_id?: number;

    @ApiPropertyOptional({ example: [1, 2], description: 'IDs das roles/perfis a serem associadas', type: [Number] })
    @IsOptional()
    @IsArray({ message: 'role_ids deve ser um array' })
    @IsInt({ each: true, message: 'Cada ID de role deve ser um número inteiro' })
    @Type(() => Number)
    role_ids?: number[];
}

