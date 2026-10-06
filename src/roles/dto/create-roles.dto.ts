import { IsNotEmpty, IsArray, ValidateNested, IsString } from "class-validator";
import { Type } from "class-transformer";

class PermissionDto {
    @IsString()
    @IsNotEmpty()
    controller: string;

    @IsString()
    @IsNotEmpty()
    method: string;
}

export class CreateRoleDto {
    @IsNotEmpty({ message: 'O nome é obrigatório!' })
    name: string;

    @IsArray({ message: 'A permissão deve ser um array!' })
    @ValidateNested({ each: true })
    @Type(() => PermissionDto)
    permissions: PermissionDto[];
}