import {IsNumber, IsUUID} from "class-validator";
import IBilleteraRepositorio from "../../billeteras/repositorios/BilleteraRepositorio";
import IServicioCore from "../../common/servicios/IServicioCore";
import {IContratoBookBnB} from "../servicios/ContratoBookBnB";
import {UseCase} from "../../UseCase";
import Publicacion from "../entidades/Publicacion";

export class CrearPublicacionDTO {
    @IsUUID(4)
    public publicacionId!: string;

    @IsUUID(4)
    public usuarioId!: string;

    @IsNumber()
    public precioPorNoche!: number;
}

export class CrearPublicacion implements UseCase {
    constructor(
        private readonly billeteras: IBilleteraRepositorio,
        private readonly contrato: IContratoBookBnB,
        private readonly servicioCore: IServicioCore
    ) {
    }

    async execute(body: CrearPublicacionDTO): Promise<void> {
        const billetera = await this.billeteras.obtener(body.usuarioId)
        const publicacion = new Publicacion({
            id: body.publicacionId,
            precioPorNoche: body.precioPorNoche
        })

        this.contrato.crearPublicacion(publicacion, billetera)
            .then(() => {
                this.servicioCore.notificarPublicacionCreada(publicacion)
            })
    }
}
