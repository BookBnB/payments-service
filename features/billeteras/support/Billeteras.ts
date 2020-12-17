import Recurso from "../../util/Recurso";

export default class Billeteras extends Recurso {
    static readonly BASE_URL: string = '/v1/billeteras'

    protected static baseUlr(): string {
        return this.BASE_URL;
    }

    public static async crear(context: any, usuarioId: any) {
        await this.post(context, `/${usuarioId}`, {})
    }

    public static async listar(context: any) {
        await this.get(context, `/`)
    }
}