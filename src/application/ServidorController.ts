import {Body, HttpCode, JsonController, Post} from "routing-controllers";
import {OpenAPI, ResponseSchema} from "routing-controllers-openapi";
import {CrearServidor, CrearServidorDTO} from "../domain/servidores/casos-uso/CrearServidor";
import ServidorDTO from "../domain/servidores/dtos/ServidorDTO";


@OpenAPI({security: [{basicAuth: []}]})
@JsonController('/servidores')
export class ServidorController {
    constructor(
        private readonly crearServidor: CrearServidor
    ) {
    }

    @Post('/')
    @HttpCode(201)
    @ResponseSchema(ServidorDTO)
    @OpenAPI({summary: 'Crea un servidor y devuelve el token'})
    async crear(@Body() body: CrearServidorDTO): Promise<ServidorDTO> {
        return await this.crearServidor.execute(body);
    }
}
