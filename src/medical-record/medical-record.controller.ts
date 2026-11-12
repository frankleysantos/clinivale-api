import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { MedicalRecordService } from './medical-record.service';
import { CreateMedicalRecordDto, FinishMedicalRecordDto } from './dto/create-medical-record.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { CreateMedicalCertificateDto } from './dto/create-medical-certificate.dto';
import { User } from 'src/auth/decorator/user.decorator';
import { Public } from 'src/auth/decorator/public.decorator';

@ApiTags('Prontuário Eletrônico (PEP) / Receitas / Atestados')
@ApiBearerAuth()
@Controller('medical-records')
export class MedicalRecordController {
    constructor(private readonly service: MedicalRecordService) {}

    // ==========================================
    // 1. Fichas Clínicas (Atendimentos PEP)
    // ==========================================
    @ApiOperation({ summary: 'Iniciar novo atendimento / ficha clínica PEP' })
    @Post()
    createRecord(@Body() dto: CreateMedicalRecordDto, @User() user: any) {
        return this.service.createRecord(dto, user);
    }

    @ApiOperation({ summary: 'Linha do tempo / histórico de atendimentos do paciente' })
    @ApiParam({ name: 'patientId', type: Number })
    @Get('patient/:patientId')
    findByPatient(
        @Param('patientId', ParseIntPipe) patientId: number,
        @Query('client_id') clientId?: string,
    ) {
        const parsedClientId = clientId ? parseInt(clientId, 10) : undefined;
        return this.service.getPatientRecords(patientId, parsedClientId);
    }

    @ApiOperation({ summary: 'Detalhes de um atendimento PEP' })
    @ApiParam({ name: 'id', type: Number })
    @Get(':id')
    findOneRecord(@Param('id', ParseIntPipe) id: number) {
        return this.service.getRecordById(id);
    }

    @ApiOperation({ summary: 'Finalizar atendimento clínico com SOAP e condutas (Gera imutabilidade SBIS)' })
    @ApiParam({ name: 'id', type: Number })
    @Patch(':id/finish')
    finishRecord(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: FinishMedicalRecordDto,
    ) {
        return this.service.finishRecord(id, dto);
    }

    // ==========================================
    // 2. Prescrições Médicas (ANVISA / CFM)
    // ==========================================
    @ApiOperation({ summary: 'Emitir nova prescrição médica (Simples / Controle Especial / Antimicrobiano)' })
    @Post('prescriptions')
    createPrescription(@Body() dto: CreatePrescriptionDto, @User() user: any) {
        return this.service.createPrescription(dto, user);
    }

    @ApiOperation({ summary: 'Histórico de prescrições do paciente' })
    @ApiParam({ name: 'patientId', type: Number })
    @Get('prescriptions/patient/:patientId')
    findPrescriptionsByPatient(
        @Param('patientId', ParseIntPipe) patientId: number,
        @Query('client_id') clientId?: string,
    ) {
        const parsedClientId = clientId ? parseInt(clientId, 10) : undefined;
        return this.service.getPatientPrescriptions(patientId, parsedClientId);
    }

    @ApiOperation({ summary: 'Dados formatados para impressão da prescrição (2 vias se controle especial)' })
    @ApiParam({ name: 'id', type: Number })
    @Get('prescriptions/:id/print')
    getPrescriptionPrintData(@Param('id', ParseIntPipe) id: number) {
        return this.service.getPrescriptionForPrint(id);
    }

    @Public()
    @ApiOperation({ summary: 'Validação pública de prescrição via QR Code / Código verificador' })
    @ApiParam({ name: 'code', type: String })
    @Get('prescriptions/verify/:code')
    verifyPrescription(@Param('code') code: string) {
        return this.service.verifyPrescription(code);
    }

    // ==========================================
    // 3. Atestados Médicos (CFM 1.658/2002 & 1.851/2008)
    // ==========================================
    @ApiOperation({ summary: 'Emitir atestado médico com controle de consentimento para CID' })
    @Post('certificates')
    createCertificate(@Body() dto: CreateMedicalCertificateDto, @User() user: any) {
        return this.service.createCertificate(dto, user);
    }

    @ApiOperation({ summary: 'Histórico de atestados do paciente' })
    @ApiParam({ name: 'patientId', type: Number })
    @Get('certificates/patient/:patientId')
    findCertificatesByPatient(
        @Param('patientId', ParseIntPipe) patientId: number,
        @Query('client_id') clientId?: string,
    ) {
        const parsedClientId = clientId ? parseInt(clientId, 10) : undefined;
        return this.service.getPatientCertificates(patientId, parsedClientId);
    }

    @Public()
    @ApiOperation({ summary: 'Validação pública de atestado médico via QR Code / Código verificador' })
    @ApiParam({ name: 'code', type: String })
    @Get('certificates/verify/:code')
    verifyCertificate(@Param('code') code: string) {
        return this.service.verifyCertificate(code);
    }
}
