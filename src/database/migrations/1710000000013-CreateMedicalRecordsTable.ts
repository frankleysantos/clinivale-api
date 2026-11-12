import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMedicalRecordsTable1710000000013 implements MigrationInterface {
    name = 'CreateMedicalRecordsTable1710000000013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`medical_records\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`client_id\` INT NOT NULL,
                \`patient_id\` INT NOT NULL,
                \`professional_id\` INT NOT NULL,
                \`record_type\` VARCHAR(50) NOT NULL DEFAULT 'CONSULTA',
                \`status\` VARCHAR(30) NOT NULL DEFAULT 'EM_ANDAMENTO',
                \`chief_complaint\` TEXT NULL,
                \`hda\` TEXT NULL,
                \`past_history\` TEXT NULL,
                \`family_history\` TEXT NULL,
                \`physical_exam\` TEXT NULL,
                \`vital_signs\` JSON NULL,
                \`diagnostic_hypothesis\` TEXT NULL,
                \`cid10\` VARCHAR(20) NULL,
                \`clinical_conduct\` TEXT NULL,
                \`started_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`finished_at\` DATETIME NULL,
                \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT \`FK_records_client\` FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_records_patient\` FOREIGN KEY (\`patient_id\`) REFERENCES \`patients\`(\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_records_professional\` FOREIGN KEY (\`professional_id\`) REFERENCES \`professionals\`(\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`medical_records\``);
    }
}

