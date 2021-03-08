import { Repository } from "typeorm";
import IServidorRepositorio from "../../domain/servidores/repositorios/ServidorRepositorio";
import Servidor from "../../domain/servidores/entidades/Servidor";
import ServidorInexistenteError from "../../domain/servidores/excepciones/ServidorInexistenteError";

export class ServidorRepositorio implements IServidorRepositorio {
    public constructor(
        private readonly repo: Repository<Servidor>
    ) {
    }

    guardar(servidor: Servidor): Promise<Servidor> {
        return this.repo.save(servidor);
    }

    listar(): Promise<Servidor[]> {
        return this.repo.find();
    }

    async obtenerPorToken(token: string): Promise<Servidor> {
        let servidor = await this.repo.findOne({
            where: { token: token }
        })

        if (!servidor)
            throw new ServidorInexistenteError(`El servidor con token ${token} no existe`)

        return servidor
    }
}
