import { BadRequestError, Body, HttpCode, HttpError, JsonController, Post } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import TransaccionRevertidaError from "../domain/common/TransaccionRevertidaError";
import { CrearPublicacion, CrearPublicacionDTO } from "../domain/publicaciones/casos-uso/CrearPublicacion";
import PublicacionDTO from "../domain/publicaciones/dtos/PublicacionDTO";

@OpenAPI({ security: [{basicAuth: []}] })
@JsonController('/publicaciones')
export class PublicacionController {
    constructor(
        private readonly crearPublicacion: CrearPublicacion
    ) {
    }

    @Post('/')
    @HttpCode(201)
    @ResponseSchema(PublicacionDTO)
    @OpenAPI({ summary: 'Registra una publicación en el contrato' })
    async crear(@Body() body: CrearPublicacionDTO): Promise<PublicacionDTO> {
        try {
            return await this.crearPublicacion.execute(body)
        } catch(e) {
            if (e instanceof TransaccionRevertidaError) {
                throw new BadRequestError(e.message)
            }

            throw e
        }
    }
}