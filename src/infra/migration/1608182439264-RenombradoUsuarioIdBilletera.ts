import {MigrationInterface, QueryRunner} from "typeorm";

export class RenombradoUsuarioIdBilletera1608182439264 implements MigrationInterface {
    name = 'RenombradoUsuarioIdBilletera1608182439264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "billetera" RENAME COLUMN "idUsuario" TO "usuarioId"`);
        await queryRunner.query(`ALTER TABLE "billetera" RENAME CONSTRAINT "PK_1aa2aac8205f01449c3a553ee42" TO "PK_ccb2bfb2d9ac82cf1b31927efe3"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "billetera" RENAME CONSTRAINT "PK_ccb2bfb2d9ac82cf1b31927efe3" TO "PK_1aa2aac8205f01449c3a553ee42"`);
        await queryRunner.query(`ALTER TABLE "billetera" RENAME COLUMN "usuarioId" TO "idUsuario"`);
    }

}
