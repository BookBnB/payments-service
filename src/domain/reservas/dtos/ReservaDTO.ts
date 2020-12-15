import { IsDate, IsUUID } from "class-validator"

export default class ReservaDTO {
    @IsUUID(4)
    public idReserva!: string

    @IsDate()
    public fechaInicio!: string

    @IsDate()
    public fechaFin!: string
}