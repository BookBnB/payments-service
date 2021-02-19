import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import { abi as ContractABI } from "../../contracts/BnBooking.json";
import Billetera from "../../domain/billeteras/entidades/Billetera";
import TransaccionRevertidaError from "../../domain/common/excepciones/TransaccionRevertidaError";
import {IContratoBookBnB, TransactionReceipt} from "../../domain/contrato/servicios/ContratoBookBnB";
import Reserva from "../../domain/contrato/entidades/Reserva";
import BN from "bn.js"
import Publicacion from "../../domain/contrato/entidades/Publicacion";

interface Room {
    roomId: BN
    owner: string
    price: BN
}

export class ContratoBookBnB implements IContratoBookBnB {
    async crearPublicacion(publicacion: Publicacion, billetera: Billetera): Promise<TransactionReceipt> {
        const web3 = new Web3(
            new HDWalletProvider(billetera.palabras, process.env.NODE_URL)
        )

        const contract = new web3.eth.Contract(<any>ContractABI, process.env.CONTRACT_ADDRESS)

        const tx = await contract.methods.createRoom(
            web3.utils.toWei(publicacion.precioPorNoche.toString())
        )

        const receipt = await ContratoBookBnB.ejecutar(tx, billetera);

        const evento = receipt.events!.RoomCreated;

        publicacion.setContratoId(parseInt(evento.returnValues.roomId))

        return receipt
    }

    async crearReserva(reserva: Reserva, billetera: Billetera): Promise<TransactionReceipt> {
        const web3 = new Web3(
            new HDWalletProvider(billetera.palabras, process.env.NODE_URL)
        )

        const contract = new web3.eth.Contract(<any>ContractABI, process.env.CONTRACT_ADDRESS)

        const tx = await contract.methods.intentBookingBatch(
            reserva.contratoId,
            reserva.getNocheInicio().getDate(),
            reserva.getNocheInicio().getMonth() + 1,
            reserva.getNocheInicio().getFullYear(),
            reserva.getNocheFin().getDate(),
            reserva.getNocheFin().getMonth() + 1,
            reserva.getNocheFin().getFullYear()
        )

        const room: Room = await contract.methods.rooms(reserva.contratoId).call()

        const precioTotal = new BN(room.price).mul(new BN(reserva.dias()))

        return await ContratoBookBnB.ejecutar(tx, billetera, precioTotal);
    }

    async aprobarReserva(reserva: Reserva, billeteraAnfitrion: Billetera, billeteraHuesped: Billetera): Promise<TransactionReceipt> {
        const web3 = new Web3(
            new HDWalletProvider(billeteraAnfitrion.palabras, process.env.NODE_URL)
        )

        const contract = new web3.eth.Contract(<any>ContractABI, process.env.CONTRACT_ADDRESS)

        const tx = await contract.methods.acceptBatch(
            reserva.contratoId,
            billeteraHuesped.direccion,
            reserva.getNocheInicio().getDate(),
            reserva.getNocheInicio().getMonth() + 1,
            reserva.getNocheInicio().getFullYear(),
            reserva.getNocheFin().getDate(),
            reserva.getNocheFin().getMonth() + 1,
            reserva.getNocheFin().getFullYear()
        )

        return await ContratoBookBnB.ejecutar(tx, billeteraAnfitrion)
    }

    async rechazarReserva(reserva: Reserva, billeteraAnfitrion: Billetera, billeteraHuesped: Billetera): Promise<TransactionReceipt> {
        const web3 = new Web3(
            new HDWalletProvider(billeteraAnfitrion.palabras, process.env.NODE_URL)
        )

        const contract = new web3.eth.Contract(<any>ContractABI, process.env.CONTRACT_ADDRESS)

        const tx = await contract.methods.rejectBatch(
            reserva.contratoId,
            billeteraHuesped.direccion,
            reserva.getNocheInicio().getDate(),
            reserva.getNocheInicio().getMonth() + 1,
            reserva.getNocheInicio().getFullYear(),
            reserva.getNocheFin().getDate(),
            reserva.getNocheFin().getMonth() + 1,
            reserva.getNocheFin().getFullYear()
        )

        return await ContratoBookBnB.ejecutar(tx, billeteraAnfitrion)
    }

    async cancelarReserva(reserva: Reserva, billeteraHuesped: Billetera): Promise<TransactionReceipt> {
        const web3 = new Web3(
            new HDWalletProvider(billeteraHuesped.palabras, process.env.NODE_URL)
        )

        const contract = new web3.eth.Contract(<any>ContractABI, process.env.CONTRACT_ADDRESS)

        const tx = await contract.methods.cancelBatch(
            reserva.contratoId,
            reserva.getNocheInicio().getDate(),
            reserva.getNocheInicio().getMonth() + 1,
            reserva.getNocheInicio().getFullYear(),
            reserva.getNocheFin().getDate(),
            reserva.getNocheFin().getMonth() + 1,
            reserva.getNocheFin().getFullYear()
        )

        return await ContratoBookBnB.ejecutar(tx, billeteraHuesped)
    }

    private static async ejecutar(tx: any, billetera: Billetera, value: BN = new BN(0)): Promise<TransactionReceipt> {
        try {
            return await tx.send({
                from: billetera.direccion,
                value: value
            })
        } catch (err) {
            throw TransaccionRevertidaError.desdeError(err);
        }
    }
}
