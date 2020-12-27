import Reserva from "../../reservas/entidades/Reserva";

export default interface IServicioCore {
    notificarPublicacionCreada(publicacionId: string, contratoId: number): Promise<void>
    notificarReservaCreada(reserva: Reserva): Promise<void>
    notificarReservaAprobada(reserva: Reserva): Promise<void>
    notificarReservaRechazada(reserva: Reserva): Promise<void>
}
