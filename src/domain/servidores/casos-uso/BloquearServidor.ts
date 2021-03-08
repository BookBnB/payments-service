import { UseCase } from "../../UseCase";
import ServidorDTO from "../dtos/ServidorDTO";
import IServidorRepositorio from "../repositorios/ServidorRepositorio";

export interface BloquearServidorDTO {
    bloqueado: boolean
}

export class BloquearServidor implements UseCase {
    constructor(
        private readonly servidores: IServidorRepositorio
    ) { }

    async execute(nombre: string, body: BloquearServidorDTO): Promise<ServidorDTO> {
        let servidor = await this.servidores.obtenerPorNombre(nombre)

        body.bloqueado ? servidor.bloquear() : servidor.desbloquear()

        servidor = await this.servidores.guardar(servidor)

        return new ServidorDTO(servidor)
    }

}