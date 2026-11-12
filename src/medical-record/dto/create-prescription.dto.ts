import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

export class PrescriptionItemDto {
    @ApiProperty({ example: 'Amoxicilina + Clavulanato de Potássio', description: 'Nome do medicamento ou princípio ativo' })
    @IsNotEmpty({ message: 'Nome do medicamento é obrigatório' })
    @IsString()
    medication_name: string;

    @ApiPropertyOptional({ example: '875mg + 125mg', description: 'Concentração do medicamento' })
    @IsOptional()
    @IsString()
    concentration?: string;

    @ApiPropertyOptional({ example: 'Comprimido revestido', description: 'Forma farmacêutica' })
    @IsOptional()
    @IsString()
    pharmaceutical_form?: string;

    @ApiProperty({ example: 'Tomar 1 comprimido via oral de 12 em 12 horas por 10 dias', description: 'Posologia inequívoca' })
    @IsNotEmpty({ message: 'A posologia é obrigatória' })
    @IsString()
    dosage: string;

    @ApiProperty({ example: '20 (vinte) comprimidos', description: 'Quantidade em algarismos e por extenso' })
    @IsNotEmpty({ message: 'A quantidade é obrigatória' })
    @IsString()
    quantity: string;

    @ApiPropertyOptional({ example: 'Oral', description: 'Via de administração' })
    @IsOptional()
    @IsString()
    route?: string;

    @ApiPropertyOptional({ example: false, description: 'Uso contínuo' })
    @IsOptional()
    @IsBoolean()
    continuous_use?: boolean;
}

export class CreatePrescriptionDto {
    @ApiProperty({ example: 1, description: 'ID do paciente' })
    @IsNotEmpty({ message: 'O ID do paciente é obrigatório' })
    @IsInt()
    @Type(() => Number)
    patient_id: number;

    @ApiPropertyOptional({ example: 1, description: 'ID do atendimento PEP vinculado' })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    medical_record_id?: number;

    @ApiPropertyOptional({ example: 1, description: 'ID da clínica' })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    client_id?: number;

    @ApiProperty({ example: 'SIMPLES', description: 'Tipo da receita: SIMPLES, CONTROLE_ESPECIAL, ANTIMICROBIANO' })
    @IsNotEmpty({ message: 'Tipo da receita é obrigatório' })
    @IsIn(['SIMPLES', 'CONTROLE_ESPECIAL', 'ANTIMICROBIANO'], { message: 'Tipo de receita inválido' })
    prescription_type: string;

    @ApiPropertyOptional({ example: 'Tomar com alimentos para evitar desconforto gástrico', description: 'Observações gerais' })
    @IsOptional()
    @IsString()
    observations?: string;

    @ApiPropertyOptional({ example: '2026-12-12', description: 'Data de validade da receita' })
    @IsOptional()
    @IsDateString()
    expires_at?: Date;

    @ApiProperty({ type: [PrescriptionItemDto], description: 'Itens de medicamentos prescritos' })
    @IsArray({ message: 'A lista de medicamentos deve ser um array' })
    @ValidateNested({ each: true })
    @Type(() => PrescriptionItemDto)
    items: PrescriptionItemDto[];
}

