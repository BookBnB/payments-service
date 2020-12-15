import { Body, HttpCode, JsonController, Post } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { CrearReserva, CrearReservaDTO } from "../domain/reservas/casos-uso/CrearReserva";
import Result from "./common/Result";

@OpenAPI({ security: [{basicAuth: []}] })
@JsonController('/reservas')
export class ReservaController {
    constructor(private readonly crearReserva: CrearReserva) {
    }

    @Post('/')
    @HttpCode(200)
    @ResponseSchema(Result)
    @OpenAPI({ summary: 'Registra una publicación en el contrato' })
    async crear(@Body() body: CrearReservaDTO): Promise<Result> {
        await this.crearReserva.execute(body);

        return Result.success()
    }
}