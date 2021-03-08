import { IsBoolean, IsString, IsUUID } from "class-validator";
import Servidor from "../entidades/Servidor";

export default class ServidorDTO {
    @IsUUID(4)
    public id: string

    @IsString()
    public nombre: string

    @IsString()
    public token!: string;

    @IsBoolean()
    public bloqueado!: boolean

    constructor(servidor: Servidor) {
        this.id = servidor.id as string;
        this.nombre = servidor.nombre;
        this.token = servidor.token;
        this.bloqueado = servidor.bloqueado;
    }
}
