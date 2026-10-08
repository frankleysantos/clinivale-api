import { IsNotEmpty, IsArray, ValidateNested, IsString, IsOptional, IsInt } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

class PermissionDto {
    @ApiProperty({ example: 'PatientController', description: 'Nome do controller' })
    @IsString()
    @IsNotEmpty()
    controller: string;

    @ApiProperty({ example: 'create', description: 'Nome do método ou ação' })
    @IsString()
    @IsNotEmpty()
    method: string;
}

export class CreateRoleDto {
    @ApiProperty({ example: 'ADMIN', description: 'Nome do papel/permissão' })
    @IsNotEmpty({ message: 'O nome é obrigatório!' })
    name: string;

    @ApiProperty({ type: [PermissionDto], example: [{ controller: 'PatientController', method: 'create' }], description: 'Lista de permissões' })
    @IsArray({ message: 'A permissão deve ser um array!' })
    @ValidateNested({ each: true })
    @Type(() => PermissionDto)
    permissions: PermissionDto[];

    @ApiPropertyOptional({ example: 1, description: 'ID do cliente vinculado à role (opcional)' })
    @IsOptional()
    @IsInt({ message: 'O ID do cliente deve ser um número inteiro' })
    @Type(() => Number)
    client_id?: number;
}