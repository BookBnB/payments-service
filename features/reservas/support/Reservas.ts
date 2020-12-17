import { World } from "cucumber";
import Recurso from "../../util/Recurso";

interface CreacionReserva {
    reservaId: string
    publicacionContratoId: number
    usuarioId: string
    fechaInicio: string
    fechaFin: string
}

export default class Reservas extends Recurso {
    static readonly BASE_URL: string = '/v1/reservas'

    protected static baseUlr(): string {
        return this.BASE_URL;
    }

    public static async crear(context: any, body: CreacionReserva) {
        await this.post(context, '/', body)
    }

    public static async aprobar(context: World, body: any) {
        await this.put(context, `/${body.reservaId}/aprobacion`, body)
    }

    public static async rechazar(context: World, body: any) {
        await this.put(context, `/${body.reservaId}/rechazo`, body)
    }
}