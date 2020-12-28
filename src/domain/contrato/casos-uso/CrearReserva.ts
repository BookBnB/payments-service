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
}

export class CrearReserva implements UseCase {
    constructor(
        private readonly billeteras: IBilleteraRepositorio,
        private readonly contrato: IContratoBookBnB,
        private readonly servicioCore: IServicioCore
    ) {
    }

    async execute(huespedId: string, reserva: Reserva): Promise<void> {
        const billetera = await this.billeteras.obtener(huespedId)

        this.contrato.crearReserva(reserva, billetera)
            .then(() => {
                this.servicioCore.notificarReservaCreada(reserva)
            })
    }
}
