import {Type} from "class-transformer";
import {IsDate, IsNumber, IsUUID} from "class-validator";
import IBilleteraRepositorio from "../../billeteras/repositorios/BilleteraRepositorio";
import IServicioCore from "../../common/servicios/IServicioCore";
import {IContratoBookBnB} from "../servicios/ContratoBookBnB";
import {UseCase} from "../../UseCase";
import Reserva from "../entidades/Reserva";

export class AprobarReservaDTO {
    @IsUUID(4)
    public reservaId!: string

    @IsNumber()
    public publicacionContratoId!: number

    @IsUUID(4)
    public anfitrionId!: string

    @IsUUID(4)
    public huespedId!: string

    @IsDate() @Type(() => Date)
    public fechaInicio!: Date

    @IsDate() @Type(() => Date)
    public fechaFin!: Date
}

export class AprobarReserva implements UseCase {
    constructor(
        private readonly billeteras: IBilleteraRepositorio,
        private readonly contrato: IContratoBookBnB,
        private readonly servicioCore: IServicioCore
    ) {
    }

    public async execute(anfitrionId: string, huespedId: string, reserva: Reserva): Promise<void> {
        const billeteraAnfitrion = await this.billeteras.obtener(anfitrionId)
        const billeteraHuesped = await this.billeteras.obtener(huespedId)

        this.contrato.aprobarReserva(reserva, billeteraAnfitrion, billeteraHuesped)
            .then(() => {
                this.servicioCore.notificarReservaAprobada(reserva)
            })
    }
}
