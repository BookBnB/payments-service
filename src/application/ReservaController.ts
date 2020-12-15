import { Body, HttpCode, JsonController, Post, Put } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { AprobarReserva, AprobarReservaDTO } from "../domain/reservas/casos-uso/AprobarReserva";
import { CrearReserva, CrearReservaDTO } from "../domain/reservas/casos-uso/CrearReserva";
import Result from "./common/Result";

@OpenAPI({ security: [{basicAuth: []}] })
@JsonController('/reservas')
export class ReservaController {
    constructor(
        private readonly crearReserva: CrearReserva,
        private readonly aprobarReserva: AprobarReserva
    ) {
    }

    @Post('/')
    @ResponseSchema(Result)
    @OpenAPI({ summary: 'Registra una reserva en el contrato' })
    async crear(@Body() body: CrearReservaDTO): Promise<Result> {
        await this.crearReserva.execute(body);

        return Result.success()
    }

    @Put('/:id/aprobacion')
    @ResponseSchema(Result)
    @OpenAPI({ summary: 'Aprueba un intento de reserva para una publicación' })
    async aprobar(@Body() body: AprobarReservaDTO): Promise<Result> {
        await this.aprobarReserva.execute(body)

        return Result.success()
    }
}