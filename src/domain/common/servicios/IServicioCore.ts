import PublicacionDTO from "../../publicaciones/dtos/PublicacionDTO";


export enum TipoEvento {
    NUEVA_PUBLICACION = 'NUEVA_PUBLICACION',
    NUEVA_RESERVA = "NUEVA_RESERVA"
}

export interface Evento {
    tipo: TipoEvento
    payload: any
}

export default interface IServicioCore {
    notificar(evento: Evento): Promise<void>
}