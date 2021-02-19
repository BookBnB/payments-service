import Billetera from "../../billeteras/entidades/Billetera";
import Reserva from "../entidades/Reserva";
import Publicacion from "../entidades/Publicacion";

export interface CrearPublicacion {
    contratoId: number
}

export interface TransactionReceipt {
    transactionHash: string,
    events: any,
    status: boolean
}

export interface IContratoBookBnB {
    crearPublicacion(publicacion: Publicacion, billetera: Billetera): Promise<TransactionReceipt>
    crearReserva(reserva: Reserva, billetera: Billetera): Promise<TransactionReceipt>;
    aprobarReserva(reserva: Reserva, billeteraAnfitrion: Billetera, billeteraHuesped: Billetera): Promise<TransactionReceipt>;
    rechazarReserva(reserva: Reserva, billeteraAnfitrion: Billetera, billeteraHuesped: Billetera): Promise<TransactionReceipt>;
    cancelarReserva(reserva: Reserva, billeteraHuesped: Billetera): Promise<TransactionReceipt>;
}
