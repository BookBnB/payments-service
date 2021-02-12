import Billetera from "../../billeteras/entidades/Billetera";
import Reserva from "../entidades/Reserva";
import Publicacion from "../entidades/Publicacion";


export interface CrearPublicacion {
    contratoId: number
}

export interface IContratoBookBnB {
    crearPublicacion(publicacion: Publicacion, billetera: Billetera): Promise<void>
    crearReserva(reserva: Reserva, billetera: Billetera): Promise<void>;
    aprobarReserva(reserva: Reserva, billeteraAnfitrion: Billetera, billeteraHuesped: Billetera): Promise<void>;
    rechazarReserva(reserva: Reserva, billeteraAnfitrion: Billetera, billeteraHuesped: Billetera): Promise<void>;
    cancelarReserva(reserva: Reserva, billeteraHuesped: Billetera): Promise<void>;
}
