import IBilleteraRepositorio from "../../billeteras/repositorios/BilleteraRepositorio";
import IServicioCore from "../../common/servicios/IServicioCore";
import {IContratoBookBnB} from "../servicios/ContratoBookBnB";
import {UseCase} from "../../UseCase";
import Publicacion from "../entidades/Publicacion";
import { ILogger } from "../../../infra/logging/Logger";

export class CrearPublicacion implements UseCase {
    constructor(
        private readonly billeteras: IBilleteraRepositorio,
        private readonly contrato: IContratoBookBnB,
        private readonly servicioCore: IServicioCore,
        private readonly logger: ILogger
    ) {
    }

    async execute(anfitrionId: string, publicacion: Publicacion): Promise<void> {
        const billetera = await this.billeteras.obtener(anfitrionId)

        this.contrato.crearPublicacion(publicacion, billetera)
            .then(() => {
                this.servicioCore.notificarPublicacionCreada(publicacion)
            })
            .catch((err) => {
                this.logger.error('Falla al crear publicacion:', err)
                this.servicioCore.notificarCreacionDePublicacionFallida(publicacion)
            })
    }
}
