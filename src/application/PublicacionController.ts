import { BadRequestError, Body, HttpCode, HttpError, JsonController, Post } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import TransaccionRevertidaError from "../domain/common/excepciones/TransaccionRevertidaError";
import { CrearPublicacion, CrearPublicacionDTO } from "../domain/publicaciones/casos-uso/CrearPublicacion";
import PublicacionDTO from "../domain/publicaciones/dtos/PublicacionDTO";

class Result {
    public success!: boolean
    public message!: string

    constructor(success: boolean, message: string) {
        this.success = success
        this.message = message
    }

    public static success(): Result {
        return new Result(true, 'ok')
    }
}

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