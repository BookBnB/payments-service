import { Repository } from "typeorm";
import Billetera from "../../domain/billeteras/entidades/Billetera";
import IBilleteraRepositorio from "../../domain/billeteras/repositorios/BilleteraRepositorio";
import BilleteraInexistenteError from "../../domain/billeteras/excepciones/BilleteraInexistenteError";

export class BilleteraRepositorio implements IBilleteraRepositorio {
    public constructor(
        private readonly repo: Repository<Billetera>
    ) {
    }
    
    guardar(billetera: Billetera): Promise<Billetera> {
        return this.repo.save(billetera);
    }

    async existe(id: string): Promise<Boolean> {
        const count = await this.repo.count({
            where: { usuarioId: id }
        });

        return count > 0;
    }

    async obtener(id: string): Promise<Billetera> {
        const billetera = await this.repo.findOne({
            where: { usuarioId: id }
        })

        if (!billetera)
            throw new BilleteraInexistenteError(`La billetera del usuario ${id} no existe`)
        
        return billetera;
    }
}
