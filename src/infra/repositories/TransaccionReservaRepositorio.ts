import { Repository } from "typeorm";
import TransaccionReserva from "../../domain/reservas/entidades/TransaccionReserva";
import ITransaccionReservaRepositorio from "../../domain/reservas/repositorios/TransaccionReservaRepositorio";

export class TransaccionReservaRepositorio implements ITransaccionReservaRepositorio {
    public constructor(
        private readonly repo: Repository<TransaccionReserva>
    ) {
    }

    guardar(transaccion: TransaccionReserva): Promise<TransaccionReserva> {
        return this.repo.save(transaccion)
    }

    obtener(reservaId: string): Promise<TransaccionReserva[]> {
        return this.repo.createQueryBuilder('tx')
            .innerJoin('tx.emisor', 'billetera')
            .select(['tx', 'billetera.usuarioId', 'billetera.direccion'])
            .where('tx.reservaId = :reservaId', { reservaId })
            .orderBy('fecha')
            .getMany()
    }
}