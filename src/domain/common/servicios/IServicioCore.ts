import Reserva from "../../contrato/entidades/Reserva";
import Publicacion from "../../contrato/entidades/Publicacion";

export default interface IServicioCore {
    notificarPublicacionCreada(publicacion: Publicacion): Promise<void>
    notificarReservaCreada(reserva: Reserva): Promise<void>
    notificarReservaAprobada(reserva: Reserva): Promise<void>
    notificarReservaRechazada(reserva: Reserva): Promise<void>
    notificarPublicacionRechazada(publicacion: Publicacion): Promise<void>;
}
