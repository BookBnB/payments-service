import { IsDate, IsUUID } from "class-validator"

export default class Reserva {
    @IsUUID(4)
    public id!: string

    @IsDate()
    public fechaInicio!: string

    @IsDate()
    public fechaFin!: string
}
