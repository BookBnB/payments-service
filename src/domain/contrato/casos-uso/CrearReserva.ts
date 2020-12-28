import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString, IsUUID } from "class-validator";
import IBilleteraRepositorio from "../../billeteras/repositorios/BilleteraRepositorio";
import IServicioCore from "../../common/servicios/IServicioCore";
import {IContratoBookBnB} from "../servicios/ContratoBookBnB";
import { UseCase } from "../../UseCase";
import Reserva from "../entidades/Reserva";

export class CrearReservaDTO {
    @IsString()
    public reservaId!: string;

    @IsNumber()
    public publicacionContratoId!: number;

    @IsUUID(4)
    public huespedId!: string

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
        const billetera = await this.billeteras.obtener(body.huespedId)
        const reserva = new Reserva({
            id: body.reservaId,
            contratoId: body.publicacionContratoId,
            fechaInicio: body.fechaInicio,
            fechaFin: body.fechaFin
        })

        this.contrato.crearReserva(reserva, billetera)
            .then((reserva) => {
                this.servicioCore.notificarReservaCreada(reserva)
            })
    }
}
