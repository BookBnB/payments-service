import Billetera from "../entidades/Billetera";

export default interface IBilleteraRepositorio {
    guardar(billetera: Billetera): Promise<Billetera>;
    existe(id: string): Promise<Boolean>;
}