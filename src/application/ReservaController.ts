import {Body, JsonController, Post, Put} from "routing-controllers";
import {OpenAPI, ResponseSchema} from "routing-controllers-openapi";
import {AprobarReserva, AprobarReservaDTO} from "../domain/contrato/casos-uso/AprobarReserva";
import {CrearReserva, CrearReservaDTO} from "../domain/contrato/casos-uso/CrearReserva";
import {RechazarReserva, RechazarReservaDTO} from "../domain/contrato/casos-uso/RechazarReserva";
import Result from "./common/Result";
import Reserva from "../domain/contrato/entidades/Reserva";

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
    async crear(@Body() body: CrearReservaDTO): Promise<Result> {
        await this.crearReserva.execute(body.huespedId, new Reserva({
            id: body.reservaId,
            contratoId: body.publicacionContratoId,
            fechaInicio: body.fechaInicio,
            fechaFin: body.fechaFin
        }));

        return Result.success()
    }

    @Put('/:id/aprobacion')
    @ResponseSchema(Result)
    @OpenAPI({summary: 'Aprueba un intento de reserva para una publicación'})
    async aprobar(@Body() body: AprobarReservaDTO): Promise<Result> {
        await this.aprobarReserva.execute(body.anfitrionId, body.huespedId, new Reserva({
            id: body.reservaId,
            contratoId: body.publicacionContratoId,
            fechaInicio: body.fechaInicio,
            fechaFin: body.fechaFin
        }))

        return Result.success()
    }

    @Put('/:id/rechazo')
    @ResponseSchema(Result)
    @OpenAPI({summary: 'Aprueba un intento de reserva para una publicación'})
    async rechazar(@Body() body: RechazarReservaDTO): Promise<Result> {
        await this.rechazarReserva.execute(body)

        return Result.success()
    }
}
