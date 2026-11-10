import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCouncilsTable1710000000008 implements MigrationInterface {
    name = 'CreateCouncilsTable1710000000008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`councils\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`code\` VARCHAR(20) NOT NULL UNIQUE,
                \`name\` VARCHAR(150) NOT NULL,
                \`description\` VARCHAR(255) NULL,
                \`status\` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        // Carga inicial dos Conselhos de Saúde
        await queryRunner.query(`
            INSERT INTO \`councils\` (\`code\`, \`name\`, \`description\`, \`status\`) VALUES
            ('CRM', 'Conselho Regional de Medicina', 'Médicos', 'ACTIVE'),
            ('CRO', 'Conselho Regional de Odontologia', 'Cirurgiões-Dentistas', 'ACTIVE'),
            ('CRP', 'Conselho Regional de Psicologia', 'Psicólogos', 'ACTIVE'),
            ('COREN', 'Conselho Regional de Enfermagem', 'Enfermeiros e Técnicos', 'ACTIVE'),
            ('CREFITO', 'Conselho Regional de Fisioterapia e Terapia Ocupacional', 'Fisioterapeutas e Terapeutas Ocupacionais', 'ACTIVE'),
            ('CRN', 'Conselho Regional de Nutricionistas', 'Nutricionistas', 'ACTIVE'),
            ('CRF', 'Conselho Regional de Farmácia', 'Farmacêuticos', 'ACTIVE'),
            ('CRFa', 'Conselho Regional de Fonoaudiologia', 'Fonoaudiólogos', 'ACTIVE'),
            ('CRBM', 'Conselho Regional de Biomedicina', 'Biomédicos', 'ACTIVE')
            ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`), \`description\` = VALUES(\`description\`);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`councils\``);
    }
}
