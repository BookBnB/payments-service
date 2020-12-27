import {IsNumber, IsUUID} from "class-validator";
import IBilleteraRepositorio from "../../billeteras/repositorios/BilleteraRepositorio";
import IServicioCore from "../../common/servicios/IServicioCore";
import {IContratoBookBnB} from "../../contratos/ContratoBookBnB";
import {UseCase} from "../../UseCase";

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

        this.contrato.crearPublicacion(body.precioPorNoche, billetera)
            .then(({contratoId}) => {
                this.servicioCore.notificarPublicacionCreada(body.publicacionId, contratoId)
            })
    }
}
