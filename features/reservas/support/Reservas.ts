import Recurso from "../../util/Recurso";

interface CreacionReserva {
    idReserva: string
    idPublicacionContrato: number
    idUsuario: string
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
}