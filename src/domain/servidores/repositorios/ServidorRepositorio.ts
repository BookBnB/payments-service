import Servidor from "../entidades/Servidor";

export default interface IServidorRepositorio {
    guardar(servidor: Servidor): Promise<Servidor>

    listar(): Promise<Servidor[]>;

    obtenerPorToken(token: string): Promise<Servidor>;
}
