import {MigrationInterface, QueryRunner} from "typeorm";

export class billetera1606631336373 implements MigrationInterface {
    name = 'billetera1606631336373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "billetera" ("idUsuario" uuid NOT NULL, "direccion" character varying NOT NULL, "palabras" character varying NOT NULL, CONSTRAINT "PK_1aa2aac8205f01449c3a553ee42" PRIMARY KEY ("idUsuario"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "billetera"`);
    }

}
