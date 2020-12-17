import { IsHexadecimal, IsNumber, IsUUID, Length } from "class-validator"

export default class PublicacionDTO {
    @IsHexadecimal()
    @Length(42, 42)
    public direccionAnfitrion!: string

    @IsUUID(4)
    public publicacionId!: string

    @IsNumber()
    public contratoId!: number

    @IsNumber()
    public precioPorNoche!: number
}