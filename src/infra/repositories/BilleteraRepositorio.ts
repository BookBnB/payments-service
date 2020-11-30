import { Repository } from "typeorm";
import Billetera from "../../domain/billeteras/entidades/Billetera";
import IBilleteraRepositorio from "../../domain/billeteras/repositorios/BilleteraRepositorio";

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
            where: { idUsuario: id }
        });

        return count > 0;
    }
}