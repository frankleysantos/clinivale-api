import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserClientsTable1710000000005 implements MigrationInterface {
    name = 'CreateUserClientsTable1710000000005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`user_clients\` (
                \`usersId\` INT NOT NULL,
                \`clientsId\` INT NOT NULL,
                PRIMARY KEY (\`usersId\`, \`clientsId\`),
                CONSTRAINT \`FK_user_clients_user\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT \`FK_user_clients_client\` FOREIGN KEY (\`clientsId\`) REFERENCES \`clients\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`user_clients\``);
    }
}
