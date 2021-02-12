import Reserva from "../../contrato/entidades/Reserva";
import Publicacion from "../../contrato/entidades/Publicacion";

export default interface IServicioCore {
    notificarPublicacionCreada(publicacion: Publicacion): Promise<void>
    notificarCreacionDePublicacionFallida(publicacion: Publicacion): Promise<void>;
    notificarReservaCreada(reserva: Reserva): Promise<void>
    notificarReservaAprobada(reserva: Reserva): Promise<void>
    notificarReservaRechazada(reserva: Reserva): Promise<void>
    notificarAprobacionDeReservaFallida(reserva: Reserva): Promise<void>;
    notificarRechazoDeReservaFallida(reserva: Reserva): Promise<void>;
    notificarCreacionDeReservaFallida(reserva: Reserva): Promise<void>;
    notificarReservaCancelada(reserva: Reserva): Promise<void>;
    notificarCancelacionDeReservaFallida(reserva: Reserva): Promise<void>;
}
