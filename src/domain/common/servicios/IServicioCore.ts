export enum TipoEvento {
    PUBLICACION_CREADA = 'PUBLICACION_CREADA',
    NUEVA_RESERVA = "NUEVA_RESERVA",
    RESERVA_ACEPTADA = "RESERVA_ACEPTADA",
    RESERVA_RECHAZADA = "RESERVA_RECHAZADA"
}

export interface Evento {
    tipo: TipoEvento
    payload: any
}

export default interface IServicioCore {
    notificar(evento: Evento): Promise<void>
    notificarPublicacionCreada(publicacionId: string, contratoId: number): Promise<void>
    notificarReservaCreada(reservaId: string): Promise<void>
}
