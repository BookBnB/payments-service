import { IsNumber, IsUUID } from "class-validator";
import IBilleteraRepositorio from "../../billeteras/repositorios/BilleteraRepositorio";
import { IContratoBookBnB } from "../../contratos/ContratoBookBnB";
import { UseCase } from "../../UseCase";
import PublicacionDTO from "../dtos/PublicacionDTO";

export class CrearPublicacionDTO {
    @IsUUID(4)
    public idUsuario!: string;

    @IsNumber()
    public precioPorNoche!: number;
}

export class CrearPublicacion implements UseCase {
    constructor(
        private readonly billeteras: IBilleteraRepositorio,
        private readonly contrato: IContratoBookBnB
    ) {
    }

    async execute(body: CrearPublicacionDTO): Promise<PublicacionDTO> {
        const billetera = await this.billeteras.obtener(body.idUsuario)

        return await this.contrato.crearPublicacion(body.precioPorNoche, billetera)
    }
}