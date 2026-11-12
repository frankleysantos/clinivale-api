import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecordEntity } from './entities/medical-record.entity';
import { PrescriptionEntity } from './entities/prescription.entity';
import { PrescriptionItemEntity } from './entities/prescription-item.entity';
import { MedicalCertificateEntity } from './entities/medical-certificate.entity';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecordController } from './medical-record.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MedicalRecordEntity,
            PrescriptionEntity,
            PrescriptionItemEntity,
            MedicalCertificateEntity,
        ]),
    ],
    controllers: [MedicalRecordController],
    providers: [MedicalRecordService],
    exports: [MedicalRecordService],
})
export class MedicalRecordModule {}

