import { IsDate, IsUUID } from "class-validator"

export interface ReservaConstructor {
    id: string
    fechaInicio: Date
    fechaFin: Date
}

export default class Reserva {
    @IsUUID(4)
    public id!: string

    @IsDate()
    public fechaInicio!: Date

    @IsDate()
    public fechaFin!: Date

    constructor(args: ReservaConstructor) {
        Object.assign(this, args)
    }
}
