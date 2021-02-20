import IBilleteraRepositorio from "../../billeteras/repositorios/BilleteraRepositorio";
import IServicioCore from "../../common/servicios/IServicioCore";
import {IContratoBookBnB} from "../servicios/ContratoBookBnB";
import {UseCase} from "../../UseCase";
import Reserva from "../entidades/Reserva";
import ITransaccionReservaRepositorio from "../../reservas/repositorios/TransaccionReservaRepositorio";
import { EventoReserva } from "../../reservas/entidades/TransaccionReserva";

export class RechazarReserva implements UseCase {
    constructor(
        private readonly billeteras: IBilleteraRepositorio,
        private readonly contrato: IContratoBookBnB,
        private readonly servicioCore: IServicioCore,
        private readonly transaccionesReservas: ITransaccionReservaRepositorio
    ) {
    }

    public async execute(anfitrionId: string, huespedId: string, reserva: Reserva): Promise<void> {
        const billeteraAnfitrion = await this.billeteras.obtener(anfitrionId)
        const billeteraHuesped = await this.billeteras.obtener(huespedId)

        this.contrato.rechazarReserva(reserva, billeteraAnfitrion, billeteraHuesped)
            .then((receipt) => {
                this.servicioCore.notificarReservaRechazada(reserva)
                return {
                    hash: receipt.transactionHash,
                    exito: receipt.status
                }
            })
            .catch(() => {
                this.servicioCore.notificarRechazoDeReservaFallida(reserva)
                return {
                    exito: false
                }
            })
            .then(({ hash, exito }: any) => {
                return this.transaccionesReservas.guardar({
                    hash,
                    evento: EventoReserva.RECHAZO,
                    reservaId: reserva.id,
                    emisor: billeteraAnfitrion,
                    exito
                })
            })
    }
}
