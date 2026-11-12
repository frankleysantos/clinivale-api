import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMedicalCertificateDto {
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

    @ApiProperty({ example: 'REPOUSO_MEDICO', description: 'Tipo do atestado: REPOUSO_MEDICO, COMPARECIMENTO, APTIDAO_FISICA, ACOMPANHANTE' })
    @IsNotEmpty({ message: 'Tipo do atestado é obrigatório' })
    @IsIn(['REPOUSO_MEDICO', 'COMPARECIMENTO', 'APTIDAO_FISICA', 'ACOMPANHANTE'])
    certificate_type: string;

    @ApiPropertyOptional({ example: 3, description: 'Dias de afastamento / repouso' })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    days_off?: number;

    @ApiPropertyOptional({ example: '3 (três) dias', description: 'Dias por extenso' })
    @IsOptional()
    @IsString()
    days_off_text?: string;

    @ApiPropertyOptional({ example: 'J06.9', description: 'Código CID-10' })
    @IsOptional()
    @IsString()
    cid10?: string;

    @ApiProperty({ example: true, description: 'Consentimento explícito do paciente para inclusão de CID-10 (CFM 1.658/2002)' })
    @IsBoolean({ message: 'O consentimento do CID deve ser um valor booleano' })
    cid_authorized_by_patient: boolean;

    @ApiProperty({ example: 'Atesto para os devidos fins que o paciente necessita de repouso por motivo de saúde...', description: 'Texto do atestado' })
    @IsNotEmpty({ message: 'O texto do atestado é obrigatório' })
    @IsString()
    description: string;
}

