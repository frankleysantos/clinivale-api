import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreatePatientDto {

    @IsOptional()
    @IsInt({message: 'O campo id deve ser um número inteiro!'})
    @Type(() => Number)
    id?:number

    @IsNotEmpty({message: 'O campo cliente é obrigatório!'})
    @IsInt({message: 'O campo clientId deve ser um número inteiro!'})
    @Type(() => Number)
    client_id: number

    @IsNotEmpty({message: 'O campo nome é obrigatório!'})
    name: string

    @IsNotEmpty({message: 'O campo cpf é obrigatório!'})
    cpf: string

    @IsNotEmpty({message: 'O campo data de nascimento é obrigatório!'})
    birthDate: Date

    @IsNotEmpty({message: 'O campo celular é obrigatório!'})
    cellphone: string

    @IsNotEmpty({message: 'O campo email é obrigatório!'})
    email:string

    @IsOptional()
    @MinLength(2, {message: 'O campo endereço deve ter no mínimo 2 caracteres!'})
    address?: string

    @IsOptional()
    @MinLength(2, {message: 'O campo endereço deve ter no mínimo 2 caracteres!'})
    neighborhood?: string


    @IsOptional()
    @MinLength(2, {message: 'O campo endereço deve ter no mínimo 2 caracteres!'})
    city?: string


    @IsOptional()
    @MinLength(2, {message: 'O campo endereço deve ter no mínimo 2 caracteres!'})
    state?: string

    @IsOptional()
    @MinLength(2, {message: 'O campo endereço deve ter no mínimo 2 caracteres!'})
    country?: string

    @IsOptional()
    @MinLength(2, {message: 'O campo endereço deve ter no mínimo 2 caracteres!'})
    occupation?: string

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
}
