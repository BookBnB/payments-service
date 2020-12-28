import {IsDate, IsNumber, IsUUID} from "class-validator"

export interface ReservaConstructor {
    id: string
    fechaInicio: Date
    fechaFin: Date
    contratoId: number
}

export default class Reserva {
    @IsUUID(4)
    public id!: string

    @IsDate()
    public fechaInicio!: Date

    @IsDate()
    public fechaFin!: Date

    @IsNumber()
    public contratoId!: number;

    constructor(args: ReservaConstructor) {
        Object.assign(this, args)
    }

    public dias(): number {
        const timeDiff = this.fechaFin.getTime() - this.fechaInicio.getTime()

        // +1 porque el mismo dia también cuenta
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1
    }
}
