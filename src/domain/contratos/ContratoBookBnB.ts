import Billetera from "../billeteras/entidades/Billetera";
import { CrearPublicacionDTO } from "../publicaciones/casos-uso/CrearPublicacion";
import PublicacionDTO from "../publicaciones/dtos/PublicacionDTO";
import { CrearReservaDTO } from "../reservas/casos-uso/CrearReserva";

export interface IContratoBookBnB {
    crearPublicacion(parametros: CrearPublicacionDTO, billetera: Billetera): Promise<PublicacionDTO>
    crearReserva(body: CrearReservaDTO, billetera: Billetera): Promise<ReservaDTO>;
}