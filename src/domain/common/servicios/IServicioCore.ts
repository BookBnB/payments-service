import PublicacionDTO from "../../publicaciones/dtos/PublicacionDTO";

export enum TipoEvento {
    NUEVA_PUBLICACION = 'nueva_publicacion'
}

export interface Evento {
    tipo: TipoEvento
    payload: any
}

export default interface IServicioCore {
    notificar(evento: Evento): Promise<void>
}