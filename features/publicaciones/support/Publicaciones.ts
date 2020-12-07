import Recurso from "../../util/Recurso";

export default class Publicaciones extends Recurso {
    static readonly BASE_URL: string = '/v1/publicaciones'

    protected static baseUlr(): string {
        return this.BASE_URL;
    }

    public static async crear(context: any, idUsuario: string, precioPorNoche: number) {
        await this.post(context, '/', {
            idUsuario: idUsuario,
            precioPorNoche: precioPorNoche
        })
    }
}