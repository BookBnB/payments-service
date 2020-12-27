import {IsNumber, IsUUID} from "class-validator"

export interface PublicacionDTOConstructor {
    id: string
    contratoId: number
}

export default class Publicacion {
    @IsUUID(4)
    public id!: string

    @IsNumber()
    public contratoId!: number

    constructor(params: PublicacionDTOConstructor) {
        Object.assign(this, params)
    }
}
