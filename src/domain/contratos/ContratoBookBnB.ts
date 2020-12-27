import Billetera from "../billeteras/entidades/Billetera";
import { AprobarReservaDTO } from "../reservas/casos-uso/AprobarReserva";
import { CrearReservaDTO } from "../reservas/casos-uso/CrearReserva";
import { RechazarReservaDTO } from "../reservas/casos-uso/RechazarReserva";
import ReservaDTO from "../reservas/dtos/ReservaDTO";


export interface CrearPublicacion {
    contratoId: number
}

export interface IContratoBookBnB {
    crearPublicacion(precioPorNoche: number, billetera: Billetera): Promise<CrearPublicacion>
    crearReserva(body: CrearReservaDTO, billetera: Billetera): Promise<ReservaDTO>;
    aprobarReserva(body: AprobarReservaDTO, billeteraAnfitrion: Billetera, billeteraHuesped: Billetera): Promise<ReservaDTO>;
    rechazarReserva(body: RechazarReservaDTO, billeteraAnfitrion: Billetera, billeteraHuesped: Billetera): Promise<ReservaDTO>;
}
