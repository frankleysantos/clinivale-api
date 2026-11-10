import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSpecialtiesTable1710000000010 implements MigrationInterface {
    name = 'CreateSpecialtiesTable1710000000010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`specialties\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`name\` VARCHAR(150) NOT NULL,
                \`profession_id\` INT NOT NULL,
                \`description\` VARCHAR(255) NULL,
                \`status\` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT \`FK_specialties_profession\` FOREIGN KEY (\`profession_id\`) REFERENCES \`professions\`(\`id\`) ON DELETE CASCADE,
                UNIQUE KEY \`UQ_specialty_profession\` (\`profession_id\`, \`name\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        // Carga inicial das Especialidades por Profissão

        // 1. Especialidades Médicas (Médico)
        await queryRunner.query(`
            INSERT INTO \`specialties\` (\`name\`, \`profession_id\`, \`status\`)
            SELECT spec_name, p.id, 'ACTIVE'
            FROM \`professions\` p
            CROSS JOIN (
                SELECT 'Alergia e Imunologia' AS spec_name UNION ALL
                SELECT 'Anestesiologia' UNION ALL
                SELECT 'Angiologia' UNION ALL
                SELECT 'Cardiologia' UNION ALL
                SELECT 'Cirurgia Cardiovascular' UNION ALL
                SELECT 'Cirurgia da Mão' UNION ALL
                SELECT 'Cirurgia do Aparelho Digestivo' UNION ALL
                SELECT 'Cirurgia Geral' UNION ALL
                SELECT 'Cirurgia Oncológica' UNION ALL
                SELECT 'Cirurgia Pediátrica' UNION ALL
                SELECT 'Cirurgia Plástica' UNION ALL
                SELECT 'Cirurgia Torácica' UNION ALL
                SELECT 'Cirurgia Vascular' UNION ALL
                SELECT 'Clínica Médica' UNION ALL
                SELECT 'Coloproctologia' UNION ALL
                SELECT 'Dermatologia' UNION ALL
                SELECT 'Endocrinologia e Metabologia' UNION ALL
                SELECT 'Endoscopia' UNION ALL
                SELECT 'Gastroenterologia' UNION ALL
                SELECT 'Genética Médica' UNION ALL
                SELECT 'Geriatria' UNION ALL
                SELECT 'Ginecologia e Obstetrícia' UNION ALL
                SELECT 'Hematologia e Hemoterapia' UNION ALL
                SELECT 'Infectologia' UNION ALL
                SELECT 'Mastologia' UNION ALL
                SELECT 'Medicina de Emergência' UNION ALL
                SELECT 'Medicina de Família e Comunidade' UNION ALL
                SELECT 'Medicina do Trabalho' UNION ALL
                SELECT 'Medicina Física e Reabilitação' UNION ALL
                SELECT 'Medicina Intensiva' UNION ALL
                SELECT 'Nefrologia' UNION ALL
                SELECT 'Neurocirurgia' UNION ALL
                SELECT 'Neurologia' UNION ALL
                SELECT 'Nutrologia' UNION ALL
                SELECT 'Oftalmologia' UNION ALL
                SELECT 'Oncologia Clínica' UNION ALL
                SELECT 'Ortopedia e Traumatologia' UNION ALL
                SELECT 'Otorrinolaringologia' UNION ALL
                SELECT 'Patologia' UNION ALL
                SELECT 'Pediatria' UNION ALL
                SELECT 'Pneumologia' UNION ALL
                SELECT 'Psiquiatria' UNION ALL
                SELECT 'Radiologia e Diagnóstico por Imagem' UNION ALL
                SELECT 'Radioterapia' UNION ALL
                SELECT 'Reumatologia' UNION ALL
                SELECT 'Urologia'
            ) AS specs
            WHERE p.name = 'Médico'
            ON DUPLICATE KEY UPDATE \`status\` = VALUES(\`status\`);
        `);

        // 2. Especialidades de Psicologia (Psicólogo)
        await queryRunner.query(`
            INSERT INTO \`specialties\` (\`name\`, \`profession_id\`, \`status\`)
            SELECT spec_name, p.id, 'ACTIVE'
            FROM \`professions\` p
            CROSS JOIN (
                SELECT 'Psicologia Clínica' AS spec_name UNION ALL
                SELECT 'Psicanálise' UNION ALL
                SELECT 'Terapia Cognitivo-Comportamental (TCC)' UNION ALL
                SELECT 'Neuropsicologia' UNION ALL
                SELECT 'Psicologia Hospitalar' UNION ALL
                SELECT 'Psicologia Social' UNION ALL
                SELECT 'Psicopedagogia' UNION ALL
                SELECT 'Psicologia Jurídica' UNION ALL
                SELECT 'Psicoterapia Infantil'
            ) AS specs
            WHERE p.name = 'Psicólogo'
            ON DUPLICATE KEY UPDATE \`status\` = VALUES(\`status\`);
        `);

        // 3. Especialidades de Fisioterapia (Fisioterapeuta)
        await queryRunner.query(`
            INSERT INTO \`specialties\` (\`name\`, \`profession_id\`, \`status\`)
            SELECT spec_name, p.id, 'ACTIVE'
            FROM \`professions\` p
            CROSS JOIN (
                SELECT 'Fisioterapia Respiratória' AS spec_name UNION ALL
                SELECT 'Fisioterapia Traumato-Ortopédica' UNION ALL
                SELECT 'Fisioterapia Neurofuncional' UNION ALL
                SELECT 'Fisioterapia Dermatofuncional' UNION ALL
                SELECT 'Fisioterapia Esportiva' UNION ALL
                SELECT 'Fisioterapia em Terapia Intensiva' UNION ALL
                SELECT 'Fisioterapia Pediátrica' UNION ALL
                SELECT 'Quiropraxia e Osteopatia'
            ) AS specs
            WHERE p.name = 'Fisioterapeuta'
            ON DUPLICATE KEY UPDATE \`status\` = VALUES(\`status\`);
        `);

        // 4. Especialidades de Odontologia (Cirurgião-Dentista)
        await queryRunner.query(`
            INSERT INTO \`specialties\` (\`name\`, \`profession_id\`, \`status\`)
            SELECT spec_name, p.id, 'ACTIVE'
            FROM \`professions\` p
            CROSS JOIN (
                SELECT 'Ortodontia' AS spec_name UNION ALL
                SELECT 'Endodontia' UNION ALL
                SELECT 'Implantodontia' UNION ALL
                SELECT 'Periodontia' UNION ALL
                SELECT 'Odontopediatria' UNION ALL
                SELECT 'Cirurgia e Traumatologia Bucomaxilofacial' UNION ALL
                SELECT 'Prótese Dentária' UNION ALL
                SELECT 'Harmonização Orofacial' UNION ALL
                SELECT 'Dentística'
            ) AS specs
            WHERE p.name = 'Cirurgião-Dentista'
            ON DUPLICATE KEY UPDATE \`status\` = VALUES(\`status\`);
        `);

        // 5. Especialidades de Nutrição (Nutricionista)
        await queryRunner.query(`
            INSERT INTO \`specialties\` (\`name\`, \`profession_id\`, \`status\`)
            SELECT spec_name, p.id, 'ACTIVE'
            FROM \`professions\` p
            CROSS JOIN (
                SELECT 'Nutrição Clínica' AS spec_name UNION ALL
                SELECT 'Nutrição Esportiva' UNION ALL
                SELECT 'Nutrição Funcional' UNION ALL
                SELECT 'Nutrição Materno-Infantil' UNION ALL
                SELECT 'Fitoterapia Aplicada à Nutrição' UNION ALL
                SELECT 'Nutrição Comportamental'
            ) AS specs
            WHERE p.name = 'Nutricionista'
            ON DUPLICATE KEY UPDATE \`status\` = VALUES(\`status\`);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`specialties\``);
    }
}
