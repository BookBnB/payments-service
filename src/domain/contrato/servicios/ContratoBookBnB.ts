import Billetera from "../../billeteras/entidades/Billetera";
import { RechazarReservaDTO } from "../casos-uso/RechazarReserva";
import Reserva from "../entidades/Reserva";
import Publicacion from "../entidades/Publicacion";


export interface CrearPublicacion {
    contratoId: number
}

export interface IContratoBookBnB {
    crearPublicacion(publicacion: Publicacion, billetera: Billetera): Promise<Publicacion>
    crearReserva(reserva: Reserva, billetera: Billetera): Promise<Reserva>;
    aprobarReserva(reserva: Reserva, billeteraAnfitrion: Billetera, billeteraHuesped: Billetera): Promise<Reserva>;
    rechazarReserva(body: RechazarReservaDTO, billeteraAnfitrion: Billetera, billeteraHuesped: Billetera): Promise<Reserva>;
}
