import {IsNumber, IsOptional, IsUUID} from "class-validator"

export interface PublicacionDTOConstructor {
    id: string
    contratoId?: number
    precioPorNoche: number
}

export default class Publicacion {
    @IsUUID(4)
    public id!: string

    @IsNumber() @IsOptional()
    public contratoId?: number

    @IsNumber()
    public precioPorNoche!: number

    constructor(params: PublicacionDTOConstructor) {
        Object.assign(this, params)
    }

    setContratoId(contratoId: number) {
        this.contratoId = contratoId;
    }
}
