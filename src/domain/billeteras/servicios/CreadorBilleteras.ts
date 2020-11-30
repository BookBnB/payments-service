import UUID from "../../common/UUID";
import Billetera from "../entidades/Billetera";

export interface ICreadorBilleteras {
    crear(id: UUID): Promise<Billetera>
}