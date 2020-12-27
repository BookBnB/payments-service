import {HttpCode, HttpError, JsonController, Params, Post} from "routing-controllers";
import {OpenAPI, ResponseSchema} from "routing-controllers-openapi";
import {CrearBilletera} from "../domain/billeteras/casos-uso/CrearBilletera";
import BilleteraDTO from "../domain/billeteras/dtos/BilleteraDTO";
import BilleteraYaExisteError from "../domain/billeteras/excepciones/BilleteraYaExisteError";
import UUID from "../domain/common/entidades/UUID";

@OpenAPI({security: [{basicAuth: []}]})
@JsonController('/billeteras')
export class BilleteraController {
    constructor(
        private readonly crearBilletera: CrearBilletera
    ) {
    }

    @Post('/:id')
    @HttpCode(201)
    @ResponseSchema(BilleteraDTO)
    @OpenAPI({summary: 'Crea una billetera'})
    async crear(@Params() id: UUID): Promise<BilleteraDTO> {
        try {
            return await this.crearBilletera.execute(id);
        } catch (e) {
            if (e instanceof BilleteraYaExisteError) {
                throw new HttpError(409, e.message);
            }

            throw e
        }
    }
}
