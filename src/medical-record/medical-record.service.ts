import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecordEntity } from './entities/medical-record.entity';
import { PrescriptionEntity } from './entities/prescription.entity';
import { PrescriptionItemEntity } from './entities/prescription-item.entity';
import { MedicalCertificateEntity } from './entities/medical-certificate.entity';
import { CreateMedicalRecordDto, FinishMedicalRecordDto } from './dto/create-medical-record.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { CreateMedicalCertificateDto } from './dto/create-medical-certificate.dto';
import * as crypto from 'crypto';

@Injectable()
export class MedicalRecordService {
    constructor(
        @InjectRepository(MedicalRecordEntity)
        private readonly recordRepository: Repository<MedicalRecordEntity>,
        @InjectRepository(PrescriptionEntity)
        private readonly prescriptionRepository: Repository<PrescriptionEntity>,
        @InjectRepository(PrescriptionItemEntity)
        private readonly prescriptionItemRepository: Repository<PrescriptionItemEntity>,
        @InjectRepository(MedicalCertificateEntity)
        private readonly certificateRepository: Repository<MedicalCertificateEntity>,
    ) {}

    // Gera código seguro de verificação pública alfanumérico (ex: CLV-8F4A-91C2)
    private generateVerificationCode(prefix: string): string {
        const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
        const secondHex = crypto.randomBytes(4).toString('hex').toUpperCase();
        return `${prefix}-${randomHex}-${secondHex}`;
    }

    // ==========================================
    // 1. Fichas Clínicas (Atendimentos PEP)
    // ==========================================
    async createRecord(dto: CreateMedicalRecordDto, user?: any) {
        const clientId = dto.client_id || user?.client?.id || user?.clientId || user?.clients?.[0]?.id;
        const professionalId = user?.professional?.id || user?.professional_id || 1;

        if (!clientId) {
            throw new BadRequestException('Clínica não informada.');
        }

        const record = this.recordRepository.create({
            ...dto,
            client_id: Number(clientId),
            professional_id: Number(professionalId),
            started_at: new Date(),
            status: 'EM_ANDAMENTO',
        });

        return this.recordRepository.save(record);
    }

    async getPatientRecords(patientId: number, clientId?: number) {
        return this.recordRepository.find({
            where: {
                patient_id: Number(patientId),
                ...(clientId ? { client_id: Number(clientId) } : {}),
            },
            relations: [
                'professional',
                'professional.user',
                'professional.profession',
                'professional.council',
                'prescriptions',
                'prescriptions.items',
                'certificates',
            ],
            order: { started_at: 'DESC' },
        });
    }

    async getRecordById(id: number) {
        const record = await this.recordRepository.findOne({
            where: { id: Number(id) },
            relations: [
                'patient',
                'professional',
                'professional.user',
                'professional.profession',
                'professional.council',
                'prescriptions',
                'prescriptions.items',
                'certificates',
            ],
        });

        if (!record) {
            throw new NotFoundException(`Atendimento PEP #${id} não encontrado.`);
        }

        return record;
    }

    async finishRecord(id: number, dto: FinishMedicalRecordDto) {
        const record = await this.getRecordById(id);

        if (record.status === 'FINALIZADO') {
            throw new BadRequestException('Este atendimento já foi finalizado e é imutável (SBIS).');
        }

        record.status = 'FINALIZADO';
        record.finished_at = new Date();
        if (dto.cid10) record.cid10 = dto.cid10;
        if (dto.clinical_conduct) record.clinical_conduct = dto.clinical_conduct;

        return this.recordRepository.save(record);
    }

    // ==========================================
    // 2. Prescrições e Receitas Eletrônicas
    // ==========================================
    async createPrescription(dto: CreatePrescriptionDto, user?: any) {
        const clientId = dto.client_id || user?.client?.id || user?.clientId || user?.clients?.[0]?.id;
        const professionalId = user?.professional?.id || user?.professional_id || 1;

        if (!clientId) {
            throw new BadRequestException('Clínica não informada.');
        }

        const verificationCode = this.generateVerificationCode('REC');

        // Calcula validade padrão caso não informada
        let expiresAt = dto.expires_at ? new Date(dto.expires_at) : new Date();
        if (!dto.expires_at) {
            if (dto.prescription_type === 'ANTIMICROBIANO') {
                expiresAt.setDate(expiresAt.getDate() + 10); // RDC 20/2011: 10 dias
            } else if (dto.prescription_type === 'CONTROLE_ESPECIAL') {
                expiresAt.setDate(expiresAt.getDate() + 30); // Portaria 344/98: 30 dias
            } else {
                expiresAt.setDate(expiresAt.getDate() + 60); // Receita comum: 60 dias
            }
        }

        const items = dto.items.map(item => this.prescriptionItemRepository.create(item));

        const prescription = this.prescriptionRepository.create({
            client_id: Number(clientId),
            patient_id: Number(dto.patient_id),
            professional_id: Number(professionalId),
            medical_record_id: dto.medical_record_id ? Number(dto.medical_record_id) : null,
            prescription_type: dto.prescription_type,
            observations: dto.observations,
            status: 'ATIVA',
            verification_code: verificationCode,
            expires_at: expiresAt,
            items,
        });

        return this.prescriptionRepository.save(prescription);
    }

    async getPatientPrescriptions(patientId: number, clientId?: number) {
        return this.prescriptionRepository.find({
            where: {
                patient_id: Number(patientId),
                ...(clientId ? { client_id: Number(clientId) } : {}),
            },
            relations: [
                'items',
                'professional',
                'professional.user',
                'professional.profession',
                'professional.council',
            ],
            order: { createdAt: 'DESC' },
        });
    }

    async getPrescriptionForPrint(id: number) {
        const prescription = await this.prescriptionRepository.findOne({
            where: { id: Number(id) },
            relations: [
                'client',
                'patient',
                'professional',
                'professional.user',
                'professional.profession',
                'professional.council',
                'items',
            ],
        });

        if (!prescription) {
            throw new NotFoundException(`Prescrição #${id} não encontrada.`);
        }

        return prescription;
    }

    async verifyPrescription(code: string) {
        const prescription = await this.prescriptionRepository.findOne({
            where: { verification_code: code },
            relations: [
                'client',
                'patient',
                'professional',
                'professional.user',
                'professional.profession',
                'professional.council',
                'items',
            ],
        });

        if (!prescription) {
            throw new NotFoundException('Documento não encontrado ou código validador inválido.');
        }

        const isExpired = prescription.expires_at ? new Date() > new Date(prescription.expires_at) : false;

        return {
            isValid: true,
            isExpired,
            prescription: {
                code: prescription.verification_code,
                type: prescription.prescription_type,
                status: prescription.status,
                issuedAt: prescription.createdAt,
                expiresAt: prescription.expires_at,
                patient: {
                    name: prescription.patient?.name,
                    cpf: prescription.patient?.cpf,
                },
                professional: {
                    name: prescription.professional?.user?.name,
                    profession: prescription.professional?.profession?.name,
                    council: `${prescription.professional?.council?.code || ''} ${prescription.professional?.council_number}/${prescription.professional?.council_uf}`,
                },
                clinic: {
                    name: prescription.client?.name,
                },
                items: prescription.items?.map(i => ({
                    medication: i.medication_name,
                    concentration: i.concentration,
                    dosage: i.dosage,
                    quantity: i.quantity,
                })),
            },
        };
    }

    // ==========================================
    // 3. Atestados Médicos
    // ==========================================
    async createCertificate(dto: CreateMedicalCertificateDto, user?: any) {
        const clientId = dto.client_id || user?.client?.id || user?.clientId || user?.clients?.[0]?.id;
        const professionalId = user?.professional?.id || user?.professional_id || 1;

        if (!clientId) {
            throw new BadRequestException('Clínica não informada.');
        }

        // Validação CFM 1.658/2002: CID só pode ser incluído se autorizado expressamente
        const finalCid = dto.cid_authorized_by_patient ? dto.cid10 : null;
        const verificationCode = this.generateVerificationCode('ATE');

        const certificate = this.certificateRepository.create({
            client_id: Number(clientId),
            patient_id: Number(dto.patient_id),
            professional_id: Number(professionalId),
            medical_record_id: dto.medical_record_id ? Number(dto.medical_record_id) : null,
            certificate_type: dto.certificate_type,
            days_off: dto.days_off,
            days_off_text: dto.days_off_text,
            cid10: finalCid,
            cid_authorized_by_patient: !!dto.cid_authorized_by_patient,
            description: dto.description,
            verification_code: verificationCode,
        });

        return this.certificateRepository.save(certificate);
    }

    async getPatientCertificates(patientId: number, clientId?: number) {
        return this.certificateRepository.find({
            where: {
                patient_id: Number(patientId),
                ...(clientId ? { client_id: Number(clientId) } : {}),
            },
            relations: [
                'professional',
                'professional.user',
                'professional.profession',
                'professional.council',
            ],
            order: { createdAt: 'DESC' },
        });
    }

    async verifyCertificate(code: string) {
        const certificate = await this.certificateRepository.findOne({
            where: { verification_code: code },
            relations: [
                'client',
                'patient',
                'professional',
                'professional.user',
                'professional.profession',
                'professional.council',
            ],
        });

        if (!certificate) {
            throw new NotFoundException('Atestado não encontrado ou código validador inválido.');
        }

        return {
            isValid: true,
            certificate: {
                code: certificate.verification_code,
                type: certificate.certificate_type,
                issuedAt: certificate.createdAt,
                daysOff: certificate.days_off,
                daysOffText: certificate.days_off_text,
                cid10: certificate.cid_authorized_by_patient ? certificate.cid10 : 'Oculto por determinação ética (CFM 1.658/2002)',
                patient: {
                    name: certificate.patient?.name,
                    cpf: certificate.patient?.cpf,
                },
                professional: {
                    name: certificate.professional?.user?.name,
                    council: `${certificate.professional?.council?.code || ''} ${certificate.professional?.council_number}/${certificate.professional?.council_uf}`,
                },
                clinic: {
                    name: certificate.client?.name,
                },
            },
        };
    }
}

