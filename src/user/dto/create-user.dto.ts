import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { IsEmailUnique } from "./validators/is-email-unique.decorator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ProfessionalDto {
    @ApiProperty({ example: 1, description: 'ID da profissão (Médico, Fisioterapeuta, etc.)' })
    @IsInt({ message: 'O ID da profissão deve ser um número inteiro' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'Profissão é obrigatória' })
    profession_id: number;

    @ApiPropertyOptional({ example: 1, description: 'ID do conselho profissional (opcional)' })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    council_id?: number;

    @ApiProperty({ example: '123456', description: 'Número do conselho' })
    @IsString()
    @IsNotEmpty({ message: 'Número do conselho é obrigatório' })
    council_number: string;

    @ApiProperty({ example: 'SP', description: 'UF do conselho' })
    @IsString()
    @IsNotEmpty({ message: 'UF do conselho é obrigatória' })
    council_uf: string;

    @ApiPropertyOptional({ example: [1, 2], description: 'IDs das especialidades vinculadas', type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @Type(() => Number)
    specialty_ids?: number[];
}

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

    @ApiPropertyOptional({ example: true, description: 'Indica se o usuário é um profissional de saúde' })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    is_health_professional?: boolean;

    @ApiPropertyOptional({ type: ProfessionalDto, description: 'Dados do profissional de saúde (se for profissional)' })
    @IsOptional()
    @ValidateNested()
    @Type(() => ProfessionalDto)
    professional?: ProfessionalDto;
}
