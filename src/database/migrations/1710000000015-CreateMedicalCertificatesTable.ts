import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMedicalCertificatesTable1710000000015 implements MigrationInterface {
    name = 'CreateMedicalCertificatesTable1710000000015'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`medical_certificates\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`client_id\` INT NOT NULL,
                \`patient_id\` INT NOT NULL,
                \`professional_id\` INT NOT NULL,
                \`medical_record_id\` INT NULL,
                \`certificate_type\` VARCHAR(50) NOT NULL DEFAULT 'REPOUSO_MEDICO',
                \`days_off\` INT NULL,
                \`days_off_text\` VARCHAR(100) NULL,
                \`cid10\` VARCHAR(20) NULL,
                \`cid_authorized_by_patient\` BOOLEAN NOT NULL DEFAULT FALSE,
                \`description\` TEXT NOT NULL,
                \`verification_code\` VARCHAR(50) NOT NULL UNIQUE,
                \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT \`FK_certificates_client\` FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_certificates_patient\` FOREIGN KEY (\`patient_id\`) REFERENCES \`patients\`(\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_certificates_professional\` FOREIGN KEY (\`professional_id\`) REFERENCES \`professionals\`(\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_certificates_record\` FOREIGN KEY (\`medical_record_id\`) REFERENCES \`medical_records\`(\`id\`) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`medical_certificates\``);
    }
}

