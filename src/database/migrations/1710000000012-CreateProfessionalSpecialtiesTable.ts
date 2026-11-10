import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProfessionalSpecialtiesTable1710000000012 implements MigrationInterface {
    name = 'CreateProfessionalSpecialtiesTable1710000000012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`professional_specialties\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`professional_id\` INT NOT NULL,
                \`specialty_id\` INT NOT NULL,
                \`is_main\` BOOLEAN NOT NULL DEFAULT FALSE,
                \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT \`FK_ps_professional\` FOREIGN KEY (\`professional_id\`) REFERENCES \`professionals\`(\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_ps_specialty\` FOREIGN KEY (\`specialty_id\`) REFERENCES \`specialties\`(\`id\`) ON DELETE CASCADE,
                UNIQUE KEY \`UQ_professional_specialty\` (\`professional_id\`, \`specialty_id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`professional_specialties\``);
    }
}

