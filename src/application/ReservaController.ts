import {Body, Delete, Get, JsonController, Params, Post, Put, UseBefore} from "routing-controllers";
import {OpenAPI, ResponseSchema} from "routing-controllers-openapi";
import {AprobarReserva} from "../domain/contrato/casos-uso/AprobarReserva";
import {CrearReserva} from "../domain/contrato/casos-uso/CrearReserva";
import {RechazarReserva} from "../domain/contrato/casos-uso/RechazarReserva";
import Result from "./common/Result";
import Reserva from "../domain/contrato/entidades/Reserva";
import {IsDate, IsNumber, IsString, IsUUID} from "class-validator";
import {Type} from "class-transformer";
import { CancelarReserva } from "../domain/contrato/casos-uso/CancelarReserva";
import TransaccionReserva from "../domain/reservas/entidades/TransaccionReserva";
import { ListarTransaccionesReserva } from "../domain/reservas/casos-uso/ListarTransaccionesReserva";
import APITokenMiddleware from "./middlewares/APITokenMiddleware";

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
@UseBefore(APITokenMiddleware)
export class ReservaController {
    constructor(
        private readonly crearReserva: CrearReserva,
        private readonly aprobarReserva: AprobarReserva,
        private readonly rechazarReserva: RechazarReserva,
        private readonly cancelarReserva: CancelarReserva,
        private readonly listarTransaccionesReserva: ListarTransaccionesReserva
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

    @Put('/:id/cancelacion')
    @ResponseSchema(Result)
    @OpenAPI({summary: 'Cancela un intento de reserva para una publicación'})
    async cancelar(@Body() body: OperarConReservaDTO): Promise<Result> {
        await this.cancelarReserva.execute(body.huespedId, body.reserva())

        return Result.success()
    }

    @Get('/:id/transacciones')
    @ResponseSchema(TransaccionReserva, {isArray: true})
    @OpenAPI({summary: 'Muestra una lista de transacciones para una reserva'})
    async listarTransacciones(@Params() {id}: any): Promise<TransaccionReserva[]> {
        return await this.listarTransaccionesReserva.execute(id)
    }
}
