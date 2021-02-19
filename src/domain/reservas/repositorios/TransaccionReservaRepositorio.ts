import TransaccionReserva from "../entidades/TransaccionReserva";

export default interface ITransaccionReservaRepositorio {
    guardar(transaccion: TransaccionReserva): Promise<TransaccionReserva>
    obtener(id: string): Promise<TransaccionReserva[]>;
}