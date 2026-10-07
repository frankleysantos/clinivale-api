import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAuthDto {
    @ApiProperty({ example: 'admin@clinivale.com', description: 'E-mail do usuário' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório' })
    email: string;

    @ApiProperty({ example: '123456', description: 'Senha do usuário' })
    @IsNotEmpty({ message: 'A senha é obrigatória' })
    password: string;

    @ApiProperty({ example: 1, description: 'ID do cliente/clínica selecionado', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'O client_id deve ser um número' })
    client_id?: number;
}

