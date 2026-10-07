import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePatientDto {

    @ApiPropertyOptional({ example: 1, description: 'ID do paciente' })
    @IsOptional()
    @IsInt({message: 'O campo id deve ser um número inteiro!'})
    @Type(() => Number)
    id?:number

    @ApiPropertyOptional({ example: 1, description: 'ID do cliente vinculado ao paciente (opcional; utiliza cliente do usuário logado por padrão)' })
    @IsOptional()
    @IsInt({message: 'O campo clientId deve ser um número inteiro!'})
    @Type(() => Number)
    client_id?: number

    @ApiProperty({ example: 'João da Silva', description: 'Nome completo do paciente' })
    @IsNotEmpty({message: 'O campo nome é obrigatório!'})
    name: string

    @ApiProperty({ example: '52998224725', description: 'CPF válido do paciente' })
    @IsNotEmpty({message: 'O campo cpf é obrigatório!'})
    cpf: string

    @ApiProperty({ example: '1990-05-15', description: 'Data de nascimento (YYYY-MM-DD)' })
    @IsNotEmpty({message: 'O campo data de nascimento é obrigatório!'})
    birthDate: Date

    @ApiProperty({ example: '11988887777', description: 'Número de telefone/celular' })
    @IsNotEmpty({message: 'O campo celular é obrigatório!'})
    cellphone: string

    @ApiProperty({ example: 'joao.silva@email.com', description: 'Endereço de e-mail' })
    @IsNotEmpty({message: 'O campo email é obrigatório!'})
    email:string

    @ApiPropertyOptional({ example: 'Rua das Flores, 123', description: 'Logradouro/Endereço' })
    @IsOptional()
    @MinLength(2, {message: 'O campo endereço deve ter no mínimo 2 caracteres!'})
    address?: string

    @ApiPropertyOptional({ example: 'Jardins', description: 'Bairro' })
    @IsOptional()
    @MinLength(2, {message: 'O campo endereço deve ter no mínimo 2 caracteres!'})
    neighborhood?: string

    @ApiPropertyOptional({ example: 'São Paulo', description: 'Cidade' })
    @IsOptional()
    @MinLength(2, {message: 'O campo endereço deve ter no mínimo 2 caracteres!'})
    city?: string

    @ApiPropertyOptional({ example: 'SP', description: 'Estado (UF)' })
    @IsOptional()
    @MinLength(2, {message: 'O campo endereço deve ter no mínimo 2 caracteres!'})
    state?: string

    @ApiPropertyOptional({ example: 'Brasil', description: 'País' })
    @IsOptional()
    @MinLength(2, {message: 'O campo endereço deve ter no mínimo 2 caracteres!'})
    country?: string

    @ApiPropertyOptional({ example: 'Engenheiro', description: 'Profissão' })
    @IsOptional()
    @MinLength(2, {message: 'O campo endereço deve ter no mínimo 2 caracteres!'})
    occupation?: string
}
// id serial4 NOT NULL,
// 	"name" varchar(255) NOT NULL,
// 	cpf varchar(255) NOT NULL,
// 	"birthDate" date NOT NULL,
// 	cellphone varchar(255) NOT NULL,
// 	email varchar(255) NOT NULL,
// 	address varchar(255) NOT NULL,
// 	neighborhood varchar(255) NOT NULL,
// 	city varchar(255) NOT NULL,
// 	state varchar(255) NOT NULL,
// 	country varchar(255) NOT NULL,
// 	occupation varchar(255) NOT NULL,
// 	"clientIdId" int4 NULL,

