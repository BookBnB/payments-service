import Billetera from "../billeteras/entidades/Billetera";
import { AprobarReservaDTO } from "../reservas/casos-uso/AprobarReserva";
import { CrearReservaDTO } from "../reservas/casos-uso/CrearReserva";
import { RechazarReservaDTO } from "../reservas/casos-uso/RechazarReserva";
import Reserva from "../reservas/entidades/Reserva";
import Publicacion from "../publicaciones/entidades/Publicacion";


export interface CrearPublicacion {
    contratoId: number
}

export interface IContratoBookBnB {
    crearPublicacion(publicacion: Publicacion, billetera: Billetera): Promise<Publicacion>
    crearReserva(body: CrearReservaDTO, billetera: Billetera): Promise<Reserva>;
    aprobarReserva(body: AprobarReservaDTO, billeteraAnfitrion: Billetera, billeteraHuesped: Billetera): Promise<Reserva>;
    rechazarReserva(body: RechazarReservaDTO, billeteraAnfitrion: Billetera, billeteraHuesped: Billetera): Promise<Reserva>;
}
