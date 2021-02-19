import { UseCase } from "../../UseCase";
import TransaccionReserva from "../entidades/TransaccionReserva";
import ITransaccionReservaRepositorio from "../repositorios/TransaccionReservaRepositorio";

export class ListarTransaccionesReserva implements UseCase {
    constructor(
        private readonly transaccionesReserva: ITransaccionReservaRepositorio
    ) {
    }

    async execute(id: string): Promise<TransaccionReserva[]> {
        return this.transaccionesReserva.obtener(id)
    }
}