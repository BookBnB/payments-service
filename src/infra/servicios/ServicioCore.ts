import axios from "axios";
import IServicioCore from "../../domain/common/servicios/IServicioCore";
import Reserva from "../../domain/contrato/entidades/Reserva";
import Publicacion from "../../domain/contrato/entidades/Publicacion";

export enum TipoEvento {
    PUBLICACION_CREADA = 'PUBLICACION_CREADA',
    PUBLICACION_RECHAZADA = 'PUBLICACION_RECHAZADA',
    RESERVA_CREADA = "RESERVA_CREADA",
    RESERVA_ACEPTADA = "RESERVA_ACEPTADA",
    RESERVA_RECHAZADA = "RESERVA_RECHAZADA",
    RESERVA_ACEPTACION_FALLIDA = "RESERVA_ACEPTACION_FALLIDA",
    RESERVA_RECHAZO_FALLIDO = "RESERVA_RECHAZO_FALLIDO"
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

    async notificarPublicacionRechazada(publicacion: Publicacion): Promise<void> {
        await this.notificar(new Evento(TipoEvento.PUBLICACION_RECHAZADA,{
            publicacionId: publicacion.id
        }))
    }

    async notificarReservaCreada(reserva: Reserva): Promise<void> {
        await this.notificar(new Evento(TipoEvento.RESERVA_CREADA,{
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

    async notificarAprobacionDeReservaFallida(reserva: Reserva): Promise<void> {
        await this.notificar(new Evento(TipoEvento.RESERVA_ACEPTACION_FALLIDA, {
            reservaId: reserva.id
        }))
    }

    async notificarRechazoDeReservaFallida(reserva: Reserva): Promise<void> {
        await this.notificar(new Evento(TipoEvento.RESERVA_RECHAZO_FALLIDO, {
            reservaId: reserva.id
        }))
    }
}
