import IBilleteraRepositorio from "../../billeteras/repositorios/BilleteraRepositorio";
import IServicioCore from "../../common/servicios/IServicioCore";
import {IContratoBookBnB} from "../servicios/ContratoBookBnB";
import { UseCase } from "../../UseCase";
import Reserva from "../entidades/Reserva";

export class CrearReserva implements UseCase {
    constructor(
        private readonly billeteras: IBilleteraRepositorio,
        private readonly contrato: IContratoBookBnB,
        private readonly servicioCore: IServicioCore
    ) {
    }

    async execute(huespedId: string, reserva: Reserva): Promise<void> {
        const billetera = await this.billeteras.obtener(huespedId)

        this.contrato.crearReserva(reserva, billetera)
            .then(() => {
                this.servicioCore.notificarReservaCreada(reserva)
            })
            .catch(() => {
                this.servicioCore.notificarCreacionDeReservaFallida(reserva)
            })
    }
}
