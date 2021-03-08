import {MigrationInterface, QueryRunner} from "typeorm";

export class BloqueoServidor1615226413260 implements MigrationInterface {
    name = 'BloqueoServidor1615226413260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "servidor" ADD "bloqueado" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "servidor" DROP COLUMN "bloqueado"`);
    }

}
