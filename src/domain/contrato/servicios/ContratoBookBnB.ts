import Billetera from "../../billeteras/entidades/Billetera";
import { AprobarReservaDTO } from "../casos-uso/AprobarReserva";
import { CrearReservaDTO } from "../casos-uso/CrearReserva";
import { RechazarReservaDTO } from "../casos-uso/RechazarReserva";
import Reserva from "../entidades/Reserva";
import Publicacion from "../entidades/Publicacion";


export interface CrearPublicacion {
    contratoId: number
}

export interface IContratoBookBnB {
    crearPublicacion(publicacion: Publicacion, billetera: Billetera): Promise<Publicacion>
    crearReserva(reserva: Reserva, billetera: Billetera): Promise<Reserva>;
    aprobarReserva(body: AprobarReservaDTO, billeteraAnfitrion: Billetera, billeteraHuesped: Billetera): Promise<Reserva>;
    rechazarReserva(body: RechazarReservaDTO, billeteraAnfitrion: Billetera, billeteraHuesped: Billetera): Promise<Reserva>;
}
