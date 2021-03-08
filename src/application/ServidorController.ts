import {Body, Get, HttpCode, JsonController, Post, UseBefore} from "routing-controllers";
import {OpenAPI, ResponseSchema} from "routing-controllers-openapi";
import {CrearServidor, CrearServidorDTO} from "../domain/servidores/casos-uso/CrearServidor";
import ServidorDTO from "../domain/servidores/dtos/ServidorDTO";
import {ListarServidores} from "../domain/servidores/casos-uso/ListarServidores";
import APITokenMiddleware from "./middlewares/APITokenMiddleware";


@OpenAPI({security: [{basicAuth: []}]})
@JsonController('/servidores')
@UseBefore(APITokenMiddleware)
export class ServidorController {
    constructor(
        private readonly crearServidor: CrearServidor,
        private readonly listarServidores: ListarServidores
    ) {
    }

    @Post('/')
    @HttpCode(201)
    @ResponseSchema(ServidorDTO)
    @OpenAPI({summary: 'Crea un servidor y devuelve el token'})
    async crear(@Body() body: CrearServidorDTO): Promise<ServidorDTO> {
        return await this.crearServidor.execute(body);
    }

    @Get('/')
    @OpenAPI({summary: 'Muestra una lista de servidores'})
    @ResponseSchema(ServidorDTO, {isArray: true})
    async listar(): Promise<ServidorDTO[]> {
        return await this.listarServidores.execute();
    }
}
