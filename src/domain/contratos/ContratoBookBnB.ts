import Billetera from "../billeteras/entidades/Billetera";
import { CrearPublicacionDTO } from "../publicaciones/casos-uso/CrearPublicacion";
import PublicacionDTO from "../publicaciones/dtos/PublicacionDTO";
import { AprobarReservaDTO } from "../reservas/casos-uso/AprobarReserva";
import { CrearReservaDTO } from "../reservas/casos-uso/CrearReserva";
import { RechazarReservaDTO } from "../reservas/casos-uso/RechazarReserva";
import ReservaDTO from "../reservas/dtos/ReservaDTO";

export interface IContratoBookBnB {
    crearPublicacion(parametros: CrearPublicacionDTO, billetera: Billetera): Promise<PublicacionDTO>
    crearReserva(body: CrearReservaDTO, billetera: Billetera): Promise<ReservaDTO>;
    aprobarReserva(body: AprobarReservaDTO, billeteraAnfitrion: Billetera, billeteraHuesped: Billetera): Promise<ReservaDTO>;
    rechazarReserva(body: RechazarReservaDTO, billeteraAnfitrion: Billetera, billeteraHuesped: Billetera): Promise<ReservaDTO>;
}
