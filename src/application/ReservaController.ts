import {Body, JsonController, Post, Put} from "routing-controllers";
import {OpenAPI, ResponseSchema} from "routing-controllers-openapi";
import {AprobarReserva} from "../domain/contrato/casos-uso/AprobarReserva";
import {CrearReserva} from "../domain/contrato/casos-uso/CrearReserva";
import {RechazarReserva} from "../domain/contrato/casos-uso/RechazarReserva";
import Result from "./common/Result";
import Reserva from "../domain/contrato/entidades/Reserva";
import {IsDate, IsNumber, IsString, IsUUID} from "class-validator";
import {Type} from "class-transformer";

class ReservaDTO {
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

    reserva() {
        return new Reserva({
            id: this.reservaId,
            contratoId: this.publicacionContratoId,
            fechaInicio: this.fechaInicio,
            fechaFin: this.fechaFin
        })
    }
}

class OperarConReservaDTO extends ReservaDTO {
    @IsUUID(4)
    public anfitrionId!: string
}

@OpenAPI({security: [{basicAuth: []}]})
@JsonController('/reservas')
export class ReservaController {
    constructor(
        private readonly crearReserva: CrearReserva,
        private readonly aprobarReserva: AprobarReserva,
        private readonly rechazarReserva: RechazarReserva
    ) {
    }

    @Post('/')
    @ResponseSchema(Result)
    @OpenAPI({summary: 'Registra una reserva en el contrato'})
    async crear(@Body() body: ReservaDTO): Promise<Result> {
        await this.crearReserva.execute(body.huespedId, body.reserva());

        return Result.success()
    }

    @Put('/:id/aprobacion')
    @ResponseSchema(Result)
    @OpenAPI({summary: 'Aprueba un intento de reserva para una publicación'})
    async aprobar(@Body() body: OperarConReservaDTO): Promise<Result> {
        await this.aprobarReserva.execute(body.anfitrionId, body.huespedId, body.reserva())

        return Result.success()
    }

    @Put('/:id/rechazo')
    @ResponseSchema(Result)
    @OpenAPI({summary: 'Rechaza un intento de reserva para una publicación'})
    async rechazar(@Body() body: OperarConReservaDTO): Promise<Result> {
        await this.rechazarReserva.execute(body.anfitrionId, body.huespedId, body.reserva())

        return Result.success()
    }
}
