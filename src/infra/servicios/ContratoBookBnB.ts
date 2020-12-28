import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import { TransactionReceipt } from 'web3-eth';
import { abi as ContractABI } from "../../contracts/BnBooking.json";
import Billetera from "../../domain/billeteras/entidades/Billetera";
import TransaccionRevertidaError from "../../domain/common/excepciones/TransaccionRevertidaError";
import {IContratoBookBnB} from "../../domain/contrato/servicios/ContratoBookBnB";
import { CrearReservaDTO } from "../../domain/contrato/casos-uso/CrearReserva";
import Reserva from "../../domain/contrato/entidades/Reserva";
import BN from "bn.js"
import { AprobarReservaDTO } from "../../domain/contrato/casos-uso/AprobarReserva";
import Publicacion from "../../domain/contrato/entidades/Publicacion";

interface Room {
    roomId: BN
    owner: string
    price: BN
}

export class ContratoBookBnB implements IContratoBookBnB {
    async crearPublicacion(publicacion: Publicacion, billetera: Billetera): Promise<Publicacion> {
        const web3 = new Web3(
            new HDWalletProvider(billetera.palabras, process.env.NODE_URL)
        )

        const contract = new web3.eth.Contract(<any>ContractABI, process.env.CONTRACT_ADDRESS)

        const tx = await contract.methods.createRoom(
            web3.utils.toWei(publicacion.precioPorNoche.toString())
        )

        const receipt = await this.ejecutar(tx, billetera);

        const evento = receipt.events!.RoomCreated;

        publicacion.setContratoId(parseInt(evento.returnValues.roomId))

        return publicacion
    }

    async crearReserva(reserva: Reserva, billetera: Billetera): Promise<Reserva> {
        const web3 = new Web3(
            new HDWalletProvider(billetera.palabras, process.env.NODE_URL)
        )

        const contract = new web3.eth.Contract(<any>ContractABI, process.env.CONTRACT_ADDRESS)

        const tx = await contract.methods.intentBookingBatch(
            reserva.contratoId,
            reserva.fechaInicio.getDate(),
            reserva.fechaInicio.getMonth() + 1,
            reserva.fechaInicio.getFullYear(),
            reserva.fechaFin.getDate(),
            reserva.fechaFin.getMonth() + 1,
            reserva.fechaFin.getFullYear()
        )

        const room: Room = await contract.methods.rooms(reserva.contratoId).call()

        const precioTotal = new BN(room.price).mul(new BN(reserva.dias()))

        await this.ejecutar(tx, billetera, precioTotal);

        return reserva
    }

    async aprobarReserva(parametros: AprobarReservaDTO, billeteraAnfitrion: Billetera, billeteraHuesped: Billetera): Promise<Reserva> {
        const web3 = new Web3(
            new HDWalletProvider(billeteraAnfitrion.palabras, process.env.NODE_URL)
        )

        const contract = new web3.eth.Contract(<any>ContractABI, process.env.CONTRACT_ADDRESS)

        const tx = await contract.methods.acceptBatch(
            parametros.publicacionContratoId,
            billeteraHuesped.direccion,
            parametros.fechaInicio.getDate(),
            parametros.fechaInicio.getMonth() + 1,
            parametros.fechaInicio.getFullYear(),
            parametros.fechaFin.getDate(),
            parametros.fechaFin.getMonth() + 1,
            parametros.fechaFin.getFullYear()
        )

        await this.ejecutar(tx, billeteraAnfitrion)

        return new Reserva({
            contratoId: 0,
            id: parametros.reservaId,
            fechaInicio: parametros.fechaInicio,
            fechaFin: parametros.fechaFin
        })
    }

    async rechazarReserva(parametros: AprobarReservaDTO, billeteraAnfitrion: Billetera, billeteraHuesped: Billetera): Promise<Reserva> {
        const web3 = new Web3(
            new HDWalletProvider(billeteraAnfitrion.palabras, process.env.NODE_URL)
        )

        const contract = new web3.eth.Contract(<any>ContractABI, process.env.CONTRACT_ADDRESS)

        const tx = await contract.methods.rejectBatch(
            parametros.publicacionContratoId,
            billeteraHuesped.direccion,
            parametros.fechaInicio.getDate(),
            parametros.fechaInicio.getMonth() + 1,
            parametros.fechaInicio.getFullYear(),
            parametros.fechaFin.getDate(),
            parametros.fechaFin.getMonth() + 1,
            parametros.fechaFin.getFullYear()
        )

        await this.ejecutar(tx, billeteraAnfitrion)

        return new Reserva({
            contratoId: 0,
            id: parametros.reservaId,
            fechaInicio: parametros.fechaInicio,
            fechaFin: parametros.fechaFin
        })
    }

    private async ejecutar(tx: any, billetera: Billetera, value: BN = new BN(0)): Promise<TransactionReceipt> {
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
