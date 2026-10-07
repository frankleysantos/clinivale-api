import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRolesTable1710000000001 implements MigrationInterface {
    name = 'CreateRolesTable1710000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`roles\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`name\` VARCHAR(50) UNIQUE NOT NULL,
                \`permissions\` JSON NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`roles\``);
    }
}
