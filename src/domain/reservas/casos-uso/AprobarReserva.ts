import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString, IsUUID } from "class-validator";
import IBilleteraRepositorio from "../../billeteras/repositorios/BilleteraRepositorio";
import IServicioCore, { TipoEvento } from "../../common/servicios/IServicioCore";
import { IContratoBookBnB } from "../../contratos/ContratoBookBnB";
import { UseCase } from "../../UseCase";

export class AprobarReservaDTO {
    @IsString()
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

export class AprobarReserva implements UseCase {
    constructor(
        private readonly billeteras: IBilleteraRepositorio,
        private readonly contrato: IContratoBookBnB,
        private readonly servicioCore: IServicioCore
    ) {
    }

    public async execute(body: AprobarReservaDTO): Promise<void> {
        const billeteraAnfitrion = await this.billeteras.obtener(body.anfitrionId)
        const billeteraHuesped = await this.billeteras.obtener(body.huespedId)

        this.contrato.aprobarReserva(body, billeteraAnfitrion, billeteraHuesped)
            .then((reserva) => {
                this.servicioCore.notificar({
                    tipo: TipoEvento.RESERVA_ACEPTADA,
                    payload: {
                        reservaId: reserva.id
                    }
                })
            })
    }
}
