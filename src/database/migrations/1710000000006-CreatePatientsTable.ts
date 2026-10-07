import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePatientsTable1710000000006 implements MigrationInterface {
    name = 'CreatePatientsTable1710000000006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`patients\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`name\` VARCHAR(255) NOT NULL,
                \`cpf\` VARCHAR(255) UNIQUE NOT NULL,
                \`birthDate\` DATE NOT NULL,
                \`cellphone\` VARCHAR(255) NOT NULL,
                \`email\` VARCHAR(255),
                \`address\` VARCHAR(255),
                \`neighborhood\` VARCHAR(255),
                \`city\` VARCHAR(255),
                \`state\` VARCHAR(255),
                \`country\` VARCHAR(255),
                \`occupation\` VARCHAR(255)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`patients\``);
    }
}
