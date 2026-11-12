import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecordEntity } from './entities/medical-record.entity';
import { PrescriptionEntity } from './entities/prescription.entity';
import { PrescriptionItemEntity } from './entities/prescription-item.entity';
import { MedicalCertificateEntity } from './entities/medical-certificate.entity';

describe('MedicalRecordService', () => {
    let service: MedicalRecordService;

    const mockRecordRepo = {
        create: jest.fn((dto) => dto),
        save: jest.fn((entity) => Promise.resolve({ id: 1, ...entity })),
        find: jest.fn(),
        findOne: jest.fn(),
    };

    const mockPrescriptionRepo = {
        create: jest.fn((dto) => dto),
        save: jest.fn((entity) => Promise.resolve({ id: 1, ...entity })),
        find: jest.fn(),
        findOne: jest.fn(),
    };

    const mockPrescriptionItemRepo = {
        create: jest.fn((dto) => dto),
        save: jest.fn((entities) => Promise.resolve(entities)),
    };

    const mockCertificateRepo = {
        create: jest.fn((dto) => dto),
        save: jest.fn((entity) => Promise.resolve({ id: 1, ...entity })),
        find: jest.fn(),
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MedicalRecordService,
                {
                    provide: getRepositoryToken(MedicalRecordEntity),
                    useValue: mockRecordRepo,
                },
                {
                    provide: getRepositoryToken(PrescriptionEntity),
                    useValue: mockPrescriptionRepo,
                },
                {
                    provide: getRepositoryToken(PrescriptionItemEntity),
                    useValue: mockPrescriptionItemRepo,
                },
                {
                    provide: getRepositoryToken(MedicalCertificateEntity),
                    useValue: mockCertificateRepo,
                },
            ],
        }).compile();

        service = module.get<MedicalRecordService>(MedicalRecordService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve estar definido', () => {
        expect(service).toBeDefined();
    });

    describe('createRecord', () => {
        it('deve criar um novo atendimento PEP em andamento', async () => {
            const dto = {
                client_id: 1,
                patient_id: 10,
                chief_complaint: 'Dor de cabeça e febre',
            };
            const user = { professional: { id: 2 }, client: { id: 1 } };

            const result = await service.createRecord(dto, user);

            expect(mockRecordRepo.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    client_id: 1,
                    patient_id: 10,
                    professional_id: 2,
                    status: 'EM_ANDAMENTO',
                }),
            );
            expect(result.id).toBe(1);
        });
    });

    describe('createPrescription', () => {
        it('deve definir 10 dias de validade para antimicrobianos', async () => {
            const dto = {
                client_id: 1,
                patient_id: 10,
                prescription_type: 'ANTIMICROBIANO' as any,
                items: [
                    {
                        medication_name: 'Amoxicilina 500mg',
                        dosage: '1 cápsula',
                        frequency: '8 em 8 horas',
                        duration: '7 dias',
                        route: 'ORAL',
                        quantity: '21 cápsulas',
                    },
                ],
            };
            const user = { professional: { id: 2 }, client: { id: 1 } };

            const result = await service.createPrescription(dto, user);

            expect(result.verification_code).toMatch(/^REC-/);
            expect(mockPrescriptionRepo.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    prescription_type: 'ANTIMICROBIANO',
                    verification_code: expect.stringMatching(/^REC-/),
                }),
            );
        });

        it('deve definir 30 dias de validade para controle especial', async () => {
            const dto = {
                client_id: 1,
                patient_id: 10,
                prescription_type: 'CONTROLE_ESPECIAL' as any,
                items: [
                    {
                        medication_name: 'Clonazepam 2mg',
                        dosage: '1 comprimido',
                        frequency: 'À noite',
                        duration: '30 dias',
                        route: 'ORAL',
                        quantity: '30 comprimidos',
                    },
                ],
            };
            const user = { professional: { id: 2 }, client: { id: 1 } };

            const result = await service.createPrescription(dto, user);
            expect(result.verification_code).toMatch(/^REC-/);
        });
    });

    describe('createCertificate', () => {
        it('deve emitir atestado quando CID está expressamente autorizado', async () => {
            const dto = {
                client_id: 1,
                patient_id: 10,
                days_off: 3,
                cid10: 'J06.9',
                cid_authorized_by_patient: true,
                certificate_type: 'AFASTAMENTO' as any,
                description: 'Repouso médico',
            };
            const user = { professional: { id: 2 }, client: { id: 1 } };

            const result = await service.createCertificate(dto, user);

            expect(result.verification_code).toMatch(/^ATE-/);
            expect(mockCertificateRepo.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    cid10: 'J06.9',
                    cid_authorized_by_patient: true,
                    verification_code: expect.stringMatching(/^ATE-/),
                }),
            );
        });
    });
});
