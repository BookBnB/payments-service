import {Body, HttpCode, JsonController, Post} from "routing-controllers";
import {OpenAPI, ResponseSchema} from "routing-controllers-openapi";
import {CrearPublicacion} from "../domain/contrato/casos-uso/CrearPublicacion";
import Result from "./common/Result";
import Publicacion from "../domain/contrato/entidades/Publicacion";
import {IsNumber, IsUUID} from "class-validator";

export class CrearPublicacionDTO {
    @IsUUID(4)
    public publicacionId!: string;

    @IsUUID(4)
    public usuarioId!: string;

    @IsNumber()
    public precioPorNoche!: number;

    publicacion() {
        return new Publicacion({
            id: this.publicacionId,
            precioPorNoche: this.precioPorNoche
        })
    }
}

@OpenAPI({security: [{basicAuth: []}]})
@JsonController('/publicaciones')
export class PublicacionController {
    constructor(
        private readonly crearPublicacion: CrearPublicacion
    ) {
    }

    @Post('/')
    @HttpCode(200)
    @ResponseSchema(Result)
    @OpenAPI({summary: 'Registra una publicación en el contrato'})
    async crear(@Body() body: CrearPublicacionDTO): Promise<Result> {
        await this.crearPublicacion.execute(body.usuarioId, body.publicacion());

        return Result.success()
    }
}
