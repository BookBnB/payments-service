import {Body, Get, HttpCode, JsonController, Params, Post, Put, UseBefore} from "routing-controllers";
import {OpenAPI, ResponseSchema} from "routing-controllers-openapi";
import {CrearServidor, CrearServidorDTO} from "../domain/servidores/casos-uso/CrearServidor";
import ServidorDTO from "../domain/servidores/dtos/ServidorDTO";
import {ListarServidores} from "../domain/servidores/casos-uso/ListarServidores";
import APITokenMiddleware from "./middlewares/APITokenMiddleware";
import { BloquearServidor, BloquearServidorDTO } from "../domain/servidores/casos-uso/BloquearServidor";


@OpenAPI({security: [{basicAuth: []}]})
@JsonController('/servidores')
@UseBefore(APITokenMiddleware)
export class ServidorController {
    constructor(
        private readonly crearServidor: CrearServidor,
        private readonly listarServidores: ListarServidores,
        private readonly bloquearServidor: BloquearServidor
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

    @Put('/:nombre/bloqueo')
    @OpenAPI({summary: 'Muestra una lista de servidores'})
    @ResponseSchema(ServidorDTO)
    async bloquear(@Params() { nombre }: any, @Body() body: BloquearServidorDTO): Promise<ServidorDTO> {
        return await this.bloquearServidor.execute(nombre, body)
    }
}
