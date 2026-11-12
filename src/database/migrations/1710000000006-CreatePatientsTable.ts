import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePatientsTable1710000000006 implements MigrationInterface {
    name = 'CreatePatientsTable1710000000006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`patients\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`name\` VARCHAR(255) NOT NULL,
                \`social_name\` VARCHAR(255) NULL,
                \`cpf\` VARCHAR(255) NULL UNIQUE,
                \`cns\` VARCHAR(20) NULL,
                \`birthDate\` DATE NOT NULL,
                \`gender\` VARCHAR(20) NOT NULL,
                \`mother_name\` VARCHAR(255) NOT NULL,
                \`father_name\` VARCHAR(255) NULL,
                \`cellphone\` VARCHAR(255) NOT NULL,
                \`email\` VARCHAR(255) NULL,
                \`postal_code\` VARCHAR(20) NULL,
                \`address\` VARCHAR(255) NULL,
                \`address_number\` VARCHAR(50) NULL,
                \`address_complement\` VARCHAR(100) NULL,
                \`neighborhood\` VARCHAR(255) NULL,
                \`city\` VARCHAR(255) NULL,
                \`state\` VARCHAR(2) NULL,
                \`country\` VARCHAR(255) NULL DEFAULT 'Brasil',
                \`occupation\` VARCHAR(255) NULL,
                \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`patients\``);
    }
}
