import IBilleteraRepositorio from "../../billeteras/repositorios/BilleteraRepositorio";
import IServicioCore from "../../common/servicios/IServicioCore";
import {IContratoBookBnB} from "../servicios/ContratoBookBnB";
import { UseCase } from "../../UseCase";
import Reserva from "../entidades/Reserva";
import ITransaccionReservaRepositorio from "../../reservas/repositorios/TransaccionReservaRepositorio";
import { EventoReserva } from "../../reservas/entidades/TransaccionReserva";
import { ILogger } from "../../../infra/logging/Logger";

export class CrearReserva implements UseCase {
    constructor(
        private readonly billeteras: IBilleteraRepositorio,
        private readonly contrato: IContratoBookBnB,
        private readonly servicioCore: IServicioCore,
        private readonly transaccionesReservas: ITransaccionReservaRepositorio,
        private readonly logger: ILogger
    ) {
    }

    async execute(huespedId: string, reserva: Reserva): Promise<void> {
        const billetera = await this.billeteras.obtener(huespedId)

        this.contrato.crearReserva(reserva, billetera)
            .then((receipt) => {
                this.servicioCore.notificarReservaCreada(reserva)
                return {
                    hash: receipt.transactionHash,
                    exito: receipt.status
                }
            })
            .catch((err) => {
                this.logger.error('Falla al crear reserva:', err)
                this.servicioCore.notificarCreacionDeReservaFallida(reserva)
                return {
                    exito: false
                }
            })
            .then(({hash, exito}: any) => {
                return this.transaccionesReservas.guardar({
                    hash,
                    evento: EventoReserva.CREACION,
                    reservaId: reserva.id,
                    emisor: billetera,
                    exito
                })
            })
    }
}
