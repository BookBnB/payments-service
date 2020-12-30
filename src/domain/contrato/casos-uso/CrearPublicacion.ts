import IBilleteraRepositorio from "../../billeteras/repositorios/BilleteraRepositorio";
import IServicioCore from "../../common/servicios/IServicioCore";
import {IContratoBookBnB} from "../servicios/ContratoBookBnB";
import {UseCase} from "../../UseCase";
import Publicacion from "../entidades/Publicacion";

export class CrearPublicacion implements UseCase {
    constructor(
        private readonly billeteras: IBilleteraRepositorio,
        private readonly contrato: IContratoBookBnB,
        private readonly servicioCore: IServicioCore
    ) {
    }

    async execute(anfitrionId: string, publicacion: Publicacion): Promise<void> {
        const billetera = await this.billeteras.obtener(anfitrionId)

        this.contrato.crearPublicacion(publicacion, billetera)
            .then(() => {
                this.servicioCore.notificarPublicacionCreada(publicacion)
            })
            .catch(() => {
                this.servicioCore.notificarCreacionDePublicacionFallida(publicacion)
            })
    }
}
