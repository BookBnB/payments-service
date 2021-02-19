import {Body, Get, HttpCode, HttpError, JsonController, NotFoundError, Params, Post} from "routing-controllers";
import {OpenAPI, ResponseSchema} from "routing-controllers-openapi";
import {CrearBilletera} from "../domain/billeteras/casos-uso/CrearBilletera";
import { VerBilletera } from "../domain/billeteras/casos-uso/VerBilletera";
import BilleteraDTO from "../domain/billeteras/dtos/BilleteraDTO";
import BilleteraInexistenteError from "../domain/billeteras/excepciones/BilleteraInexistenteError";
import BilleteraYaExisteError from "../domain/billeteras/excepciones/BilleteraYaExisteError";
import UUID from "../domain/common/entidades/UUID";

@OpenAPI({security: [{basicAuth: []}]})
@JsonController('/billeteras')
export class BilleteraController {
    constructor(
        private readonly crearBilletera: CrearBilletera,
        private readonly verBilletera: VerBilletera
    ) {
    }

    @Post('')
    @HttpCode(201)
    @ResponseSchema(BilleteraDTO)
    @OpenAPI({summary: 'Crea una billetera'})
    async crear(@Body() id: UUID): Promise<BilleteraDTO> {
        try {
            return await this.crearBilletera.execute(id);
        } catch (e) {
            if (e instanceof BilleteraYaExisteError) {
                throw new HttpError(409, e.message);
            }

            throw e
        }
    }

    @Get('/:id')
    @ResponseSchema(BilleteraDTO)
    @OpenAPI({summary: 'Visualiza la billetera de un usuario'})
    async ver(@Params() {id}: UUID): Promise<BilleteraDTO> {
        try {
            return await this.verBilletera.execute(id)
        } catch(e) {
            if (e instanceof BilleteraInexistenteError) {
                throw new NotFoundError(e.message)
            }

            throw e
        }
    }
}
