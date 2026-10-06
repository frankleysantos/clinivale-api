import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

enum CLIENTS_STATUS_ENUM {
    ATIVO = 'ATIVO',
    INATIVO = 'INATIVO'
}

enum CLIENTS_TYPE {
    FISICA = 'FISICA',
    JURIDICA = 'JURIDICA'
}

export class CreateClientDto {
    @IsOptional()
    @IsInt({message: "O campo ID deve ser um número inteiro"})
    @Type(() => Number)
    id?: number

    @IsNotEmpty({message: "O campo nome é obrigatório"})
    name: string;

    @IsOptional()
    @IsString({message: "O campo cpf deve ser uma string"})
    cpf?: string;

    @IsOptional()
    @IsString({message: "O campo cnpj deve ser uma string"})
    cnpj?: string;

    @IsEnum(CLIENTS_TYPE)
    type: CLIENTS_TYPE;

    @IsOptional()
    @IsString({message: "O campo celular deve ser uma string"})
    cellphone?: string;

    @IsOptional()
    @IsString({message: "O campo cidade deve ser uma string"})
    city?: string;

    @IsOptional()
    @IsString({message: "O campo estado deve ser uma string"})
    state?: string;

    @IsOptional()
    @IsString({message: "O campo email deve ser uma string"})
    email?: string;

    @IsOptional()
    @IsEnum(CLIENTS_STATUS_ENUM)
    status?: CLIENTS_STATUS_ENUM;
}


// CREATE TABLE public.clients (
// 	id serial4 NOT NULL,
// 	name varchar(255) NOT NULL,
// 	cpf varchar(255) NULL,
// 	cnpj varchar(255) NULL,
// 	"type" public.clients_type_enum DEFAULT 'FISICA'::clients_type_enum NOT NULL,
// 	cellphone varchar(255) NULL,
// 	city varchar(255) NULL,
// 	state varchar(255) NULL,
// 	email varchar(255) NULL,
// 	status public.clients_status_enum DEFAULT 'ATIVO'::clients_status_enum NOT NULL,
// 	CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY (id),
// 	CONSTRAINT "UQ_4245ac34add1ceeb505efc98777" UNIQUE (cpf),
// 	CONSTRAINT "UQ_c2528f5ea78df3e939950b861c0" UNIQUE (cnpj)
// );