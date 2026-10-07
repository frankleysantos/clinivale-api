import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClientPatientsTable1710000000007 implements MigrationInterface {
    name = 'CreateClientPatientsTable1710000000007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`client_patients\` (
                \`patient_id\` INT NOT NULL,
                \`client_id\` INT NOT NULL,
                PRIMARY KEY (\`patient_id\`, \`client_id\`),
                CONSTRAINT \`FK_client_patients_patient\` FOREIGN KEY (\`patient_id\`) REFERENCES \`patients\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT \`FK_client_patients_client\` FOREIGN KEY (\`client_id\`) REFERENCES \`clients\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`client_patients\``);
    }
}
