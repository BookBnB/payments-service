import axios from "axios";
import IServicioCore, {Evento} from "../../domain/common/servicios/IServicioCore";

export enum TipoEvento {
    PUBLICACION_CREADA = 'PUBLICACION_CREADA',
}

class EventoE {
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

    private webhookUrl(): string {
        return `${this.serviceUrl}${this.WEBHOOK}`
    }

    async notificar(evento: Evento): Promise<void> {
        const targetUrl = `${this.serviceUrl}${this.WEBHOOK}`;

        await axios.post(targetUrl, evento);
    }

    async notificarPublicacionCreada(publicacionId: string, contratoId: number): Promise<void> {
        await axios.post(this.webhookUrl(), new EventoE(TipoEvento.PUBLICACION_CREADA,{
            publicacionId,
            contratoId
        }));
    }
}
