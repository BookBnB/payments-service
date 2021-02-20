import {MigrationInterface, QueryRunner} from "typeorm";

export class Servidores1613836262101 implements MigrationInterface {
    name = 'Servidores1613836262101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "servidor" ("id" SERIAL NOT NULL, "nombre" text NOT NULL, "token" text NOT NULL, CONSTRAINT "PK_243457082304d7c5cfafedba752" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "servidor"`);
    }

}
