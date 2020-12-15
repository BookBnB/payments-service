import { Type } from "class-transformer";
import { IsDate, IsNumber, IsUUID } from "class-validator";
import IBilleteraRepositorio from "../../billeteras/repositorios/BilleteraRepositorio";
import IServicioCore, { TipoEvento } from "../../common/servicios/IServicioCore";
import { IContratoBookBnB } from "../../contratos/ContratoBookBnB";
import { UseCase } from "../../UseCase";

export class CrearReservaDTO {
    @IsUUID(4)
    public idReserva!: string;

    @IsNumber()
    public idPublicacionContrato!: number;

    @IsUUID(4)
    public idUsuario!: string

    @IsDate() @Type(() => Date)
    public fechaInicio!: Date

    @IsDate() @Type(() => Date)
    public fechaFin!: Date

    public dias(): number {
        const timeDiff = this.fechaFin.getTime() - this.fechaInicio.getTime()

        // +1 porque el mismo dia también cuenta
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1
    }
}

export class CrearReserva implements UseCase {
    constructor(
        private readonly billeteras: IBilleteraRepositorio,
        private readonly contrato: IContratoBookBnB,
        private readonly servicioCore: IServicioCore
    ) {
    }

    async execute(body: CrearReservaDTO): Promise<void> {
        const billetera = await this.billeteras.obtener(body.idUsuario)
        
        this.contrato.crearReserva(body, billetera)
            .then((reserva) => {
                this.servicioCore.notificar({
                    tipo: TipoEvento.NUEVA_RESERVA,
                    payload: reserva
                })
            })
    }
}