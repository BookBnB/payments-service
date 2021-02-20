import Recurso from "../../util/Recurso";

export default class Servidores extends Recurso {
    static readonly BASE_URL: string = '/v1/servidores'

    protected static baseUlr(): string {
        return this.BASE_URL;
    }

    public static async crear(context: any, nombre: string) {
        await this.post(context, '/', {
            nombre,
        })
    }
}
