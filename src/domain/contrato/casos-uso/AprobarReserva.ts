import IBilleteraRepositorio from "../../billeteras/repositorios/BilleteraRepositorio";
import IServicioCore from "../../common/servicios/IServicioCore";
import {IContratoBookBnB} from "../servicios/ContratoBookBnB";
import {UseCase} from "../../UseCase";
import Reserva from "../entidades/Reserva";
import { EventoReserva } from "../../reservas/entidades/TransaccionReserva";
import ITransaccionReservaRepositorio from "../../reservas/repositorios/TransaccionReservaRepositorio";

export class AprobarReserva implements UseCase {
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

        this.contrato.aprobarReserva(reserva, billeteraAnfitrion, billeteraHuesped)
            .then((receipt) => {
                this.servicioCore.notificarReservaAprobada(reserva)
                return {
                    hash: receipt.transactionHash,
                    exito: receipt.status
                }
            })
            .catch(() => {
                this.servicioCore.notificarAprobacionDeReservaFallida(reserva)
                return {
                    exito: false
                }
            })
            .then(({ hash, exito }: any) => {
                return this.transaccionesReservas.guardar({
                    hash,
                    evento: EventoReserva.APROBACION,
                    reservaId: reserva.id,
                    emisor: billeteraAnfitrion,
                    exito
                })
            })
    }
}
