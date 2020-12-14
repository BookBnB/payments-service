import axios from "axios";
import IServicioCore, { Evento } from "../../domain/common/servicios/IServicioCore";

export default class ServicioCore implements IServicioCore {
    private readonly CALLBACK_PREFIX = '/v1/eventos'

    constructor(private readonly serviceUrl: string) {
    }

    async notificar(evento: Evento): Promise<void> {
        const targetUrl = `${this.serviceUrl}${this.CALLBACK_PREFIX}`;

        await axios.post(targetUrl, evento);
    }
}