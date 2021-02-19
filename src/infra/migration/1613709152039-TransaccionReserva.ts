import {MigrationInterface, QueryRunner} from "typeorm";

export class TransaccionReserva1613709152039 implements MigrationInterface {
    name = 'TransaccionReserva1613709152039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaccion_reserva" ("recordId" SERIAL NOT NULL, "hash" character varying, "reservaId" text NOT NULL, "evento" text NOT NULL, "fecha" TIMESTAMP NOT NULL DEFAULT now(), "exito" boolean NOT NULL, "emisorUsuarioId" uuid, CONSTRAINT "PK_eee9cd6bcc91878abd724ef6093" PRIMARY KEY ("recordId"))`);
        await queryRunner.query(`ALTER TABLE "transaccion_reserva" ADD CONSTRAINT "FK_b47207481128be96ffb5116d614" FOREIGN KEY ("emisorUsuarioId") REFERENCES "billetera"("usuarioId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaccion_reserva" DROP CONSTRAINT "FK_b47207481128be96ffb5116d614"`);
        await queryRunner.query(`DROP TABLE "transaccion_reserva"`);
    }

}
