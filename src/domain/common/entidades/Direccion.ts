import { IsHexadecimal, Length } from "class-validator";

export default class Direccion {
    private static readonly LARGO_DIRECCION = 42;
    
    @IsHexadecimal()
    @Length(Direccion.LARGO_DIRECCION, Direccion.LARGO_DIRECCION)
    public direccion!: string;

    constructor(direccion: string) {
        this.direccion = direccion;
    }
}