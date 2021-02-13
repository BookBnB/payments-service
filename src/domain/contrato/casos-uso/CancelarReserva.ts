import IBilleteraRepositorio from "../../billeteras/repositorios/BilleteraRepositorio";
import IServicioCore from "../../common/servicios/IServicioCore";
import {IContratoBookBnB} from "../servicios/ContratoBookBnB";
import {UseCase} from "../../UseCase";
import Reserva from "../entidades/Reserva";

export class CancelarReserva implements UseCase {
    constructor(
        private readonly billeteras: IBilleteraRepositorio,
        private readonly contrato: IContratoBookBnB,
        private readonly servicioCore: IServicioCore
    ) {
    }

    public async execute(huespedId: string, reserva: Reserva): Promise<void> {
        const billeteraHuesped = await this.billeteras.obtener(huespedId)

        this.contrato.cancelarReserva(reserva, billeteraHuesped)
            .then(() => {
                this.servicioCore.notificarReservaCancelada(reserva)
            })
            .catch(() => {
                this.servicioCore.notificarCancelacionDeReservaFallida(reserva)
            })
    }
}
