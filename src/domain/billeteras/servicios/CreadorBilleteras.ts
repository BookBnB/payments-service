import UUID from "../../common/entidades/UUID";
import Billetera from "../entidades/Billetera";

export interface ICreadorBilleteras {
    crear(id: UUID): Promise<Billetera>
}