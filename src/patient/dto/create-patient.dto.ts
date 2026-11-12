import { Type } from "class-transformer";
import { IsEmail, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePatientDto {

    @ApiPropertyOptional({ example: 1, description: 'ID do paciente' })
    @IsOptional()
    @IsInt({ message: 'O campo id deve ser um número inteiro!' })
    @Type(() => Number)
    id?: number;

    @ApiPropertyOptional({ example: 1, description: 'ID do cliente vinculado ao paciente' })
    @IsOptional()
    @IsInt({ message: 'O campo client_id deve ser um número inteiro!' })
    @Type(() => Number)
    client_id?: number;

    @ApiProperty({ example: 'João da Silva', description: 'Nome completo do paciente' })
    @IsNotEmpty({ message: 'O campo nome é obrigatório!' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 'Joãozinho', description: 'Nome social do paciente' })
    @IsOptional()
    @IsString()
    social_name?: string;

    @ApiPropertyOptional({ example: '52998224725', description: 'CPF do paciente (opcional SBIS, mas validado se informado)' })
    @IsOptional()
    @IsString()
    cpf?: string;

    @ApiPropertyOptional({ example: '700000000000001', description: 'Cartão Nacional de Saúde (CNS / SUS)' })
    @IsOptional()
    @IsString()
    cns?: string;

    @ApiProperty({ example: '1990-05-15', description: 'Data de nascimento (YYYY-MM-DD)' })
    @IsNotEmpty({ message: 'O campo data de nascimento é obrigatório!' })
    birthDate: Date;

    @ApiProperty({ example: 'M', description: 'Sexo do paciente segundo padrão SBIS (M, F ou I)' })
    @IsNotEmpty({ message: 'O campo sexo é obrigatório!' })
    @IsIn(['M', 'F', 'I'], { message: 'O sexo deve ser M (Masculino), F (Feminino) ou I (Indeterminado / Não informado)' })
    gender: string;

    @ApiProperty({ example: 'Maria da Silva', description: 'Nome completo da mãe (obrigatório SBIS/CFM para desambiguação)' })
    @IsNotEmpty({ message: 'O campo nome da mãe é obrigatório!' })
    @IsString()
    mother_name: string;

    @ApiPropertyOptional({ example: 'José da Silva', description: 'Nome completo do pai (opcional)' })
    @IsOptional()
    @IsString()
    father_name?: string;

    @ApiProperty({ example: '11988887777', description: 'Número de telefone/celular' })
    @IsNotEmpty({ message: 'O campo celular é obrigatório!' })
    @IsString()
    cellphone: string;

    @ApiPropertyOptional({ example: 'joao.silva@email.com', description: 'Endereço de e-mail' })
    @IsOptional()
    @IsEmail({}, { message: 'E-mail inválido' })
    email?: string;

    @ApiPropertyOptional({ example: '01310100', description: 'CEP (Código de Endereçamento Postal)' })
    @IsOptional()
    @IsString()
    postal_code?: string;

    @ApiPropertyOptional({ example: 'Avenida Paulista', description: 'Logradouro/Endereço' })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({ example: '1000', description: 'Número do endereço' })
    @IsOptional()
    @IsString()
    address_number?: string;

    @ApiPropertyOptional({ example: 'Apto 42', description: 'Complemento do endereço' })
    @IsOptional()
    @IsString()
    address_complement?: string;

    @ApiPropertyOptional({ example: 'Bela Vista', description: 'Bairro' })
    @IsOptional()
    @IsString()
    neighborhood?: string;

    @ApiPropertyOptional({ example: 'São Paulo', description: 'Cidade' })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiPropertyOptional({ example: 'SP', description: 'Estado (UF - 2 letras)' })
    @IsOptional()
    @IsString()
    @Length(2, 2, { message: 'O estado deve conter exatamente 2 caracteres (UF)' })
    state?: string;

    @ApiPropertyOptional({ example: 'Brasil', description: 'País' })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiPropertyOptional({ example: 'Engenheiro', description: 'Profissão' })
    @IsOptional()
    @IsString()
    occupation?: string;
}
