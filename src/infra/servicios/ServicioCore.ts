import axios from "axios";
import IServicioCore from "../../domain/common/servicios/IServicioCore";
import Reserva from "../../domain/reservas/entidades/Reserva";
import Publicacion from "../../domain/publicaciones/entidades/Publicacion";

export enum TipoEvento {
    PUBLICACION_CREADA = 'PUBLICACION_CREADA',
    NUEVA_RESERVA = 'NUEVA_RESERVA',
    RESERVA_ACEPTADA = "RESERVA_ACEPTADA",
    RESERVA_RECHAZADA = "RESERVA_RECHAZADA"
}

class Evento {
    constructor(
        public readonly tipo: TipoEvento,
        public readonly payload: any
    ) {
    }
}

export default class ServicioCore implements IServicioCore {
    private readonly WEBHOOK = '/v1/eventos'

    constructor(private readonly serviceUrl: string) {
    }

    private async notificar(evento: Evento): Promise<void> {
        const targetUrl = `${this.serviceUrl}${this.WEBHOOK}`;

        await axios.post(targetUrl, evento);
    }

    async notificarPublicacionCreada(publicacion: Publicacion): Promise<void> {
        await this.notificar(new Evento(TipoEvento.PUBLICACION_CREADA,{
            publicacionId: publicacion.id,
            contratoId: publicacion.contratoId
        }))
    }

    async notificarReservaCreada(reserva: Reserva): Promise<void> {
        await this.notificar(new Evento(TipoEvento.NUEVA_RESERVA,{
            reservaId: reserva.id
        }));
    }

    async notificarReservaAprobada(reserva: Reserva): Promise<void> {
        await this.notificar(new Evento(TipoEvento.RESERVA_ACEPTADA,{
            reservaId: reserva.id
        }));
    }

    async notificarReservaRechazada(reserva: Reserva): Promise<void> {
        await this.notificar(new Evento(TipoEvento.RESERVA_RECHAZADA,{
            reservaId: reserva.id
        }));
    }
}
