import {UseCase} from "../../UseCase";
import IServidorRepositorio from "../repositorios/ServidorRepositorio";
import ServidorDTO from "../dtos/ServidorDTO";

export class ListarServidores implements UseCase {
    constructor(
        private readonly servidores: IServidorRepositorio
    ) {
    }

    async execute(): Promise<ServidorDTO[]> {
        return (await this.servidores.listar()).map(servidor => new ServidorDTO(servidor))
    }
}
