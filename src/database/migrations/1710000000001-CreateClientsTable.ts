import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClientsTable1710000000001 implements MigrationInterface {
    name = 'CreateClientsTable1710000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`clients\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`name\` VARCHAR(255) NOT NULL,
                \`cpf\` VARCHAR(255) UNIQUE,
                \`cnpj\` VARCHAR(255) UNIQUE,
                \`cellphone\` VARCHAR(255),
                \`email\` VARCHAR(255),
                \`city\` VARCHAR(255),
                \`state\` VARCHAR(255),
                \`type\` VARCHAR(50) NOT NULL DEFAULT 'FISICA',
                \`status\` VARCHAR(50) NOT NULL DEFAULT 'ATIVO'
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`clients\``);
    }
}
