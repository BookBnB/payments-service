import { IsHexadecimal, IsNumber, Length } from "class-validator"

export default class PublicacionDTO {
    @IsHexadecimal()
    @Length(42, 42)
    public direccionAnfitrion!: string

    @IsNumber()
    public idEnContrato!: number

    @IsNumber()
    public precioPorNoche!: number
}