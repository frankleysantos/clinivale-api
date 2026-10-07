import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserRolesTable1710000000004 implements MigrationInterface {
    name = 'CreateUserRolesTable1710000000004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`user_roles\` (
                \`usersId\` INT NOT NULL,
                \`rolesId\` INT NOT NULL,
                PRIMARY KEY (\`usersId\`, \`rolesId\`),
                CONSTRAINT \`FK_user_roles_user\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT \`FK_user_roles_role\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`user_roles\``);
    }
}
