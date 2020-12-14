import Billetera from "../billeteras/entidades/Billetera";
import { CrearPublicacionDTO } from "../publicaciones/casos-uso/CrearPublicacion";
import PublicacionDTO from "../publicaciones/dtos/PublicacionDTO";

export interface IContratoBookBnB {
    crearPublicacion(parametros: CrearPublicacionDTO, billetera: Billetera): Promise<PublicacionDTO>
}