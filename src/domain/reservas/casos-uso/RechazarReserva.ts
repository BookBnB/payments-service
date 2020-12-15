import { Type } from "class-transformer";
import { IsDate, IsNumber, IsUUID } from "class-validator";
import IBilleteraRepositorio from "../../billeteras/repositorios/BilleteraRepositorio";
import IServicioCore, { TipoEvento } from "../../common/servicios/IServicioCore";
import { IContratoBookBnB } from "../../contratos/ContratoBookBnB";
import { UseCase } from "../../UseCase";

export class RechazarReservaDTO {
    @IsUUID(4)
    public idReserva!: string

    @IsUUID(4)
    public idAnfitrion!: string

    @IsUUID(4)
    public idHuesped!: string

    @IsNumber()
    public idPublicacionContrato!: number

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

    public async execute(body: RechazarReservaDTO): Promise<void> {
        const billeteraAnfitrion = await this.billeteras.obtener(body.idAnfitrion)
        const billeteraHuesped = await this.billeteras.obtener(body.idHuesped)

        this.contrato.rechazarReserva(body, billeteraAnfitrion, billeteraHuesped)
            .then((reserva) => {
                this.servicioCore.notificar({
                    tipo: TipoEvento.RESERVA_RECHAZADA,
                    payload: reserva
                })
            })
    }
}