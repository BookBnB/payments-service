export default interface IServicioCore {
    notificarPublicacionCreada(publicacionId: string, contratoId: number): Promise<void>
    notificarReservaCreada(reservaId: string): Promise<void>
    notificarReservaAprobada(reservaId: string): Promise<void>
    notificarReservaRechazada(reservaId: string): Promise<void>
}
