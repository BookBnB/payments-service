export enum TipoEvento {
    NUEVA_PUBLICACION = 'NUEVA_PUBLICACION',
    NUEVA_RESERVA = "NUEVA_RESERVA",
    RESERVA_ACEPTADA = "RESERVA_ACEPTADA"
}

export interface Evento {
    tipo: TipoEvento
    payload: any
}

export default interface IServicioCore {
    notificar(evento: Evento): Promise<void>
}