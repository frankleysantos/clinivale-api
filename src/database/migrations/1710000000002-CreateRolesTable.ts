import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRolesTable1710000000002 implements MigrationInterface {
    name = 'CreateRolesTable1710000000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`roles\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`name\` VARCHAR(50) NOT NULL,
                \`permissions\` JSON NOT NULL,
                \`client_id\` INT NULL,
                CONSTRAINT \`FK_roles_client\` FOREIGN KEY (\`client_id\`) REFERENCES \`clients\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`roles\``);
    }
}
