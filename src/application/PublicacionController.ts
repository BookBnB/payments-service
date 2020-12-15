import { Body, HttpCode, JsonController, Post } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { CrearPublicacion, CrearPublicacionDTO } from "../domain/publicaciones/casos-uso/CrearPublicacion";
import Result from "./common/Result";

@OpenAPI({ security: [{basicAuth: []}] })
@JsonController('/publicaciones')
export class PublicacionController {
    constructor(
        private readonly crearPublicacion: CrearPublicacion
    ) {
    }

    @Post('/')
    @HttpCode(200)
    @ResponseSchema(Result)
    @OpenAPI({ summary: 'Registra una publicación en el contrato' })
    async crear(@Body() body: CrearPublicacionDTO): Promise<Result> {
        await this.crearPublicacion.execute(body);

        return Result.success()
    }
}