import { IsString, IsUUID } from "class-validator";
import { JSONSchema } from "class-validator-jsonschema";
import Billetera from "../entidades/Billetera";

export default class BilleteraDTO {
    @IsUUID(4)
    public usuarioId!: string;

    @JSONSchema({ example: '0x8b6Fc9476c5329672949bE6Eec5376e71484dEC4' })
    @IsString()
    public direccion!: string;

    constructor(billetera: Billetera) {
        this.usuarioId = billetera.usuarioId;
        this.direccion = billetera.direccion;
    }
}