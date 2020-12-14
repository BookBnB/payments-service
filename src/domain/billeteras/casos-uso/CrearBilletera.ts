import UUID from "../../common/entidades/UUID";
import { UseCase } from "../../UseCase";
import BilleteraDTO from "../dtos/BilleteraDTO";
import BilleteraYaExisteError from "../excepciones/BilleteraYaExisteError";
import IBilleteraRepositorio from "../repositorios/BilleteraRepositorio";
import { ICreadorBilleteras } from "../servicios/CreadorBilleteras";

export class CrearBilletera implements UseCase {
    constructor(
        private readonly creador: ICreadorBilleteras,
        private readonly billeteras: IBilleteraRepositorio
    ) {
    }

    async execute(id: UUID): Promise<BilleteraDTO> {
        if (await this.billeteras.existe(id.id)) {
            throw new BilleteraYaExisteError();
        }

        const billetera = await this.creador.crear(id);

        await this.billeteras.guardar(billetera);

        return new BilleteraDTO(billetera);
    }
}