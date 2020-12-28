import { Type } from "class-transformer";
import { IsDate, IsNumber, IsUUID } from "class-validator";
import IBilleteraRepositorio from "../../billeteras/repositorios/BilleteraRepositorio";
import IServicioCore from "../../common/servicios/IServicioCore";
import {IContratoBookBnB} from "../servicios/ContratoBookBnB";
import { UseCase } from "../../UseCase";
import Reserva from "../entidades/Reserva";

export class RechazarReservaDTO {
    @IsUUID(4)
    public reservaId!: string

    @IsUUID(4)
    public anfitrionId!: string

    @IsUUID(4)
    public huespedId!: string

    @IsNumber()
    public publicacionContratoId!: number

    @IsDate() @Type(() => Date)
    public fechaInicio!: Date

    @IsDate() @Type(() => Date)
    public fechaFin!: Date
}

export class RechazarReserva implements UseCase {
    constructor(
        private readonly billeteras: IBilleteraRepositorio,
        private readonly contrato: IContratoBookBnB,
        private readonly servicioCore: IServicioCore
    ) {
    }

    public async execute(anfitrionId: string, huespedId: string, reserva: Reserva): Promise<void> {
        const billeteraAnfitrion = await this.billeteras.obtener(anfitrionId)
        const billeteraHuesped = await this.billeteras.obtener(huespedId)

        this.contrato.rechazarReserva(reserva, billeteraAnfitrion, billeteraHuesped)
            .then(() => {
                this.servicioCore.notificarReservaRechazada(reserva)
            })
    }
}
