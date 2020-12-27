import Reserva from "../../reservas/entidades/Reserva";
import Publicacion from "../../publicaciones/entidades/Publicacion";

export default interface IServicioCore {
    notificarPublicacionCreada(publicacion: Publicacion): Promise<void>
    notificarReservaCreada(reserva: Reserva): Promise<void>
    notificarReservaAprobada(reserva: Reserva): Promise<void>
    notificarReservaRechazada(reserva: Reserva): Promise<void>
}
