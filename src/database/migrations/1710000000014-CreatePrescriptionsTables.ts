import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePrescriptionsTables1710000000014 implements MigrationInterface {
    name = 'CreatePrescriptionsTables1710000000014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Tabela de Prescrições
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`prescriptions\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`client_id\` INT NOT NULL,
                \`patient_id\` INT NOT NULL,
                \`professional_id\` INT NOT NULL,
                \`medical_record_id\` INT NULL,
                \`prescription_type\` VARCHAR(50) NOT NULL DEFAULT 'SIMPLES',
                \`status\` VARCHAR(30) NOT NULL DEFAULT 'ATIVA',
                \`verification_code\` VARCHAR(50) NOT NULL UNIQUE,
                \`verification_hash\` VARCHAR(255) NULL,
                \`observations\` TEXT NULL,
                \`expires_at\` DATE NULL,
                \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT \`FK_prescriptions_client\` FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_prescriptions_patient\` FOREIGN KEY (\`patient_id\`) REFERENCES \`patients\`(\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_prescriptions_professional\` FOREIGN KEY (\`professional_id\`) REFERENCES \`professionals\`(\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_prescriptions_record\` FOREIGN KEY (\`medical_record_id\`) REFERENCES \`medical_records\`(\`id\`) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        // 2. Tabela de Itens da Prescrição
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`prescription_items\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`prescription_id\` INT NOT NULL,
                \`medication_name\` VARCHAR(255) NOT NULL,
                \`concentration\` VARCHAR(100) NULL,
                \`pharmaceutical_form\` VARCHAR(100) NULL,
                \`dosage\` TEXT NOT NULL,
                \`quantity\` VARCHAR(100) NOT NULL,
                \`route\` VARCHAR(50) NULL DEFAULT 'Oral',
                \`continuous_use\` BOOLEAN NOT NULL DEFAULT FALSE,
                \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT \`FK_items_prescription\` FOREIGN KEY (\`prescription_id\`) REFERENCES \`prescriptions\`(\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`prescription_items\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`prescriptions\``);
    }
}

