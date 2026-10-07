import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1710000000003 implements MigrationInterface {
    name = 'CreateUsersTable1710000000003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`users\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`name\` VARCHAR(255) NOT NULL,
                \`password\` VARCHAR(255) NOT NULL,
                \`email\` VARCHAR(255) UNIQUE NOT NULL,
                \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`users\``);
    }
}
