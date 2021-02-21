import { Repository } from "typeorm";
import IServidorRepositorio from "../../domain/servidores/repositorios/ServidorRepositorio";
import Servidor from "../../domain/servidores/entidades/Servidor";

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
}
