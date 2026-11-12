import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class VitalSignsDto {
    @ApiPropertyOptional({ example: 120, description: 'Pressão Arterial Sistólica (mmHg)' })
    @IsOptional()
    @IsNumber()
    systolic_bp?: number;

    @ApiPropertyOptional({ example: 80, description: 'Pressão Arterial Diastólica (mmHg)' })
    @IsOptional()
    @IsNumber()
    diastolic_bp?: number;

    @ApiPropertyOptional({ example: 75, description: 'Frequência Cardíaca (bpm)' })
    @IsOptional()
    @IsNumber()
    heart_rate?: number;

    @ApiPropertyOptional({ example: 16, description: 'Frequência Respiratória (irpm)' })
    @IsOptional()
    @IsNumber()
    respiratory_rate?: number;

    @ApiPropertyOptional({ example: 36.5, description: 'Temperatura Corporal (°C)' })
    @IsOptional()
    @IsNumber()
    temperature?: number;

    @ApiPropertyOptional({ example: 98, description: 'Saturação de Oxigênio SpO2 (%)' })
    @IsOptional()
    @IsNumber()
    spo2?: number;

    @ApiPropertyOptional({ example: 70.5, description: 'Peso (kg)' })
    @IsOptional()
    @IsNumber()
    weight?: number;

    @ApiPropertyOptional({ example: 175, description: 'Altura (cm)' })
    @IsOptional()
    @IsNumber()
    height?: number;

    @ApiPropertyOptional({ example: 23.0, description: 'Índice de Massa Corporal (IMC)' })
    @IsOptional()
    @IsNumber()
    bmi?: number;
}

export class CreateMedicalRecordDto {
    @ApiProperty({ example: 1, description: 'ID do paciente' })
    @IsNotEmpty({ message: 'O ID do paciente é obrigatório' })
    @IsInt()
    @Type(() => Number)
    patient_id: number;

    @ApiPropertyOptional({ example: 1, description: 'ID da clínica/estabelecimento' })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    client_id?: number;

    @ApiPropertyOptional({ example: 'CONSULTA', description: 'Tipo do atendimento (CONSULTA, RETORNO, URGENCIA, TELECONSULTA)' })
    @IsOptional()
    @IsIn(['CONSULTA', 'RETORNO', 'URGENCIA', 'TELECONSULTA'])
    record_type?: string;

    @ApiPropertyOptional({ example: 'Dor de cabeça e febre há 3 dias', description: 'Queixa principal' })
    @IsOptional()
    @IsString()
    chief_complaint?: string;

    @ApiPropertyOptional({ example: 'Paciente relata cefaleia frontal pulsátil...', description: 'História da Doença Atual' })
    @IsOptional()
    @IsString()
    hda?: string;

    @ApiPropertyOptional({ example: 'Hipertensa, nega diabetes. Alérgica a penicilina', description: 'Histórico pessoal e alergias' })
    @IsOptional()
    @IsString()
    past_history?: string;

    @ApiPropertyOptional({ example: 'Mãe diabética, pai cardiopata', description: 'Histórico familiar' })
    @IsOptional()
    @IsString()
    family_history?: string;

    @ApiPropertyOptional({ example: 'BEG, corado, hidratado, orientado em tempo e espaço', description: 'Exame físico' })
    @IsOptional()
    @IsString()
    physical_exam?: string;

    @ApiPropertyOptional({ type: VitalSignsDto, description: 'Sinais vitais' })
    @IsOptional()
    @ValidateNested()
    @Type(() => VitalSignsDto)
    vital_signs?: VitalSignsDto;

    @ApiPropertyOptional({ example: 'Cefaleia tensional / Enxaqueca', description: 'Hipótese diagnóstica' })
    @IsOptional()
    @IsString()
    diagnostic_hypothesis?: string;

    @ApiPropertyOptional({ example: 'G43.9', description: 'Código CID-10' })
    @IsOptional()
    @IsString()
    cid10?: string;

    @ApiPropertyOptional({ example: 'Orientado repouso e hidratação abundante', description: 'Conduta clínica' })
    @IsOptional()
    @IsString()
    clinical_conduct?: string;
}

export class FinishMedicalRecordDto {
    @ApiPropertyOptional({ example: 'G43.9', description: 'Código CID-10 final' })
    @IsOptional()
    @IsString()
    cid10?: string;

    @ApiPropertyOptional({ example: 'Conduta e orientações finais...', description: 'Conduta clínica de encerramento' })
    @IsOptional()
    @IsString()
    clinical_conduct?: string;
}

