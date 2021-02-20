import {UseCase} from "../../UseCase";
import IServidorRepositorio from "../repositorios/ServidorRepositorio";
import Servidor from "../entidades/Servidor";
import IGeneradorToken from "../servicios/GeneradorToken";
import {IsString, MinLength} from "class-validator";
import ServidorDTO from "../dtos/ServidorDTO";

export class CrearServidorDTO {
    @IsString() @MinLength(1)
    public nombre!: string;
}

export class CrearServidor implements UseCase {
    constructor(
        private readonly servidores: IServidorRepositorio,
        private readonly generadorToken: IGeneradorToken
    ) {
    }

    async execute({nombre}: CrearServidorDTO): Promise<ServidorDTO> {
        const token = this.generadorToken.generarToken()
        const servidor = new Servidor({nombre, token})
        return new ServidorDTO(await this.servidores.guardar(servidor))
    }
}
