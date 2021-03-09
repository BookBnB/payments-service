import {MigrationInterface, QueryRunner} from "typeorm";

export class ServidoresRefactor1613840253769 implements MigrationInterface {
    name = 'ServidoresRefactor1613840253769'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "servidor" DROP CONSTRAINT "PK_243457082304d7c5cfafedba752"`);
        await queryRunner.query(`ALTER TABLE "servidor" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "servidor" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "servidor" ADD CONSTRAINT "PK_243457082304d7c5cfafedba752" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "servidor" DROP CONSTRAINT "PK_243457082304d7c5cfafedba752"`);
        await queryRunner.query(`ALTER TABLE "servidor" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "servidor" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "servidor" ADD CONSTRAINT "PK_243457082304d7c5cfafedba752" PRIMARY KEY ("id")`);
    }

}
