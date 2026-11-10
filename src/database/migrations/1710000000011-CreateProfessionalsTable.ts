import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProfessionalsTable1710000000011 implements MigrationInterface {
    name = 'CreateProfessionalsTable1710000000011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`professionals\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`user_id\` INT NOT NULL UNIQUE,
                \`client_id\` INT NULL,
                \`profession_id\` INT NOT NULL,
                \`council_id\` INT NULL,
                \`council_number\` VARCHAR(50) NOT NULL,
                \`council_uf\` VARCHAR(2) NOT NULL,
                \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT \`FK_professionals_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_professionals_client\` FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON DELETE SET NULL,
                CONSTRAINT \`FK_professionals_profession\` FOREIGN KEY (\`profession_id\`) REFERENCES \`professions\`(\`id\`) ON DELETE RESTRICT,
                CONSTRAINT \`FK_professionals_council\` FOREIGN KEY (\`council_id\`) REFERENCES \`councils\`(\`id\`) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`professionals\``);
    }
}

