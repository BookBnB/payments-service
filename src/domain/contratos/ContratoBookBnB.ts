import Billetera from "../billeteras/entidades/Billetera";
import PublicacionDTO from "../publicaciones/dtos/PublicacionDTO";

export interface IContratoBookBnB {
    crearPublicacion(precioPorNoche: number, billetera: Billetera): Promise<PublicacionDTO>
}