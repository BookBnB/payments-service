import Reserva from "../../reservas/entidades/Reserva";

export default interface IServicioCore {
    notificarPublicacionCreada(publicacionId: string, contratoId: number): Promise<void>
    notificarReservaCreada(reserva: Reserva): Promise<void>
    notificarReservaAprobada(reservaId: string): Promise<void>
    notificarReservaRechazada(reservaId: string): Promise<void>
}
