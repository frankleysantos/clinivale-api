import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProfessionsTable1710000000009 implements MigrationInterface {
    name = 'CreateProfessionsTable1710000000009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`professions\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`name\` VARCHAR(100) NOT NULL UNIQUE,
                \`council_id\` INT NULL,
                \`description\` VARCHAR(255) NULL,
                \`status\` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT \`FK_professions_council\` FOREIGN KEY (\`council_id\`) REFERENCES \`councils\`(\`id\`) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        // Carga inicial das Profissões de Saúde associadas aos respectivos conselhos
        await queryRunner.query(`
            INSERT INTO \`professions\` (\`name\`, \`council_id\`, \`description\`, \`status\`) VALUES
            ('Médico', (SELECT \`id\` FROM \`councils\` WHERE \`code\` = 'CRM' LIMIT 1), 'Profissional com formação em Medicina', 'ACTIVE'),
            ('Cirurgião-Dentista', (SELECT \`id\` FROM \`councils\` WHERE \`code\` = 'CRO' LIMIT 1), 'Profissional com formação em Odontologia', 'ACTIVE'),
            ('Psicólogo', (SELECT \`id\` FROM \`councils\` WHERE \`code\` = 'CRP' LIMIT 1), 'Profissional com formação em Psicologia', 'ACTIVE'),
            ('Fisioterapeuta', (SELECT \`id\` FROM \`councils\` WHERE \`code\` = 'CREFITO' LIMIT 1), 'Profissional com formação em Fisioterapia', 'ACTIVE'),
            ('Nutricionista', (SELECT \`id\` FROM \`councils\` WHERE \`code\` = 'CRN' LIMIT 1), 'Profissional com formação em Nutrição', 'ACTIVE'),
            ('Enfermeiro', (SELECT \`id\` FROM \`councils\` WHERE \`code\` = 'COREN' LIMIT 1), 'Profissional com formação em Enfermagem', 'ACTIVE'),
            ('Fonoaudiólogo', (SELECT \`id\` FROM \`councils\` WHERE \`code\` = 'CRFa' LIMIT 1), 'Profissional com formação em Fonoaudiologia', 'ACTIVE'),
            ('Farmacêutico', (SELECT \`id\` FROM \`councils\` WHERE \`code\` = 'CRF' LIMIT 1), 'Profissional com formação em Farmácia', 'ACTIVE'),
            ('Terapeuta Ocupacional', (SELECT \`id\` FROM \`councils\` WHERE \`code\` = 'CREFITO' LIMIT 1), 'Profissional com formação em Terapia Ocupacional', 'ACTIVE'),
            ('Biomédico', (SELECT \`id\` FROM \`councils\` WHERE \`code\` = 'CRBM' LIMIT 1), 'Profissional com formação em Biomedicina', 'ACTIVE')
            ON DUPLICATE KEY UPDATE \`council_id\` = VALUES(\`council_id\`), \`description\` = VALUES(\`description\`);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`professions\``);
    }
}
