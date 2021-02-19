import UUID from "../../common/entidades/UUID";
import { UseCase } from "../../UseCase";
import BilleteraDTO from "../dtos/BilleteraDTO";
import BilleteraYaExisteError from "../excepciones/BilleteraYaExisteError";
import IBilleteraRepositorio from "../repositorios/BilleteraRepositorio";
import { ICreadorBilleteras } from "../servicios/CreadorBilleteras";

export class VerBilletera implements UseCase {
    constructor(
        private readonly billeteras: IBilleteraRepositorio
    ) {
    }

    async execute(id: string): Promise<BilleteraDTO> {
        const billetera = await this.billeteras.obtener(id);

        return new BilleteraDTO(billetera);
    }
}