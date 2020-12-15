import axios from "axios";
import IServicioCore, { Evento } from "../../domain/common/servicios/IServicioCore";

export default class ServicioCore implements IServicioCore {
    private readonly WEBHOOK = '/v1/eventos'

    constructor(private readonly serviceUrl: string) {
    }

    async notificar(evento: Evento): Promise<void> {
        const targetUrl = `${this.serviceUrl}${this.WEBHOOK}`;

        await axios.post(targetUrl, evento);
    }
}