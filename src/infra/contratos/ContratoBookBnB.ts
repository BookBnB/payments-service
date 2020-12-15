import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import { Contract } from "web3-eth-contract"
import { TransactionReceipt } from 'web3-eth';
import { abi as ContractABI } from "../../../src/contracts/BnBooking.json";
import Billetera from "../../domain/billeteras/entidades/Billetera";
import TransaccionRevertidaError from "../../domain/common/excepciones/TransaccionRevertidaError";
import { IContratoBookBnB } from "../../domain/contratos/ContratoBookBnB";
import { CrearPublicacionDTO } from "../../domain/publicaciones/casos-uso/CrearPublicacion";
import PublicacionDTO from "../../domain/publicaciones/dtos/PublicacionDTO";
import { CrearReservaDTO } from "../../domain/reservas/casos-uso/CrearReserva";
import ReservaDTO from "../../domain/reservas/dtos/ReservaDTO";
import BN from "bn.js"

interface Room {
    roomId: BN
    owner: string
    price: BN
}

export class ContratoBookBnB implements IContratoBookBnB {
    async crearPublicacion(parametros: CrearPublicacionDTO, billetera: Billetera): Promise<PublicacionDTO> {   
        const web3 = new Web3(
            new HDWalletProvider(billetera.palabras, process.env.NODE_URL)
        )

        const contract = new web3.eth.Contract(<any>ContractABI, process.env.CONTRACT_ADDRESS)

        const tx = await contract.methods.createRoom(
            web3.utils.toWei(parametros.precioPorNoche.toString())
        )

        const receipt = await this.ejecutar(tx, billetera, web3);

        const evento = receipt.events!.RoomCreated;

        return {
            direccionAnfitrion: evento.returnValues.owner,
            idPublicacion: parametros.idPublicacion,
            idEnContrato: parseInt(evento.returnValues.roomId),
            precioPorNoche: parseFloat(web3.utils.fromWei(evento.returnValues.price))
        }
    }

    async crearReserva(parametros: CrearReservaDTO, billetera: Billetera): Promise<ReservaDTO> {
        const web3 = new Web3(
            new HDWalletProvider(billetera.palabras, process.env.NODE_URL)
        )

        const contract = new web3.eth.Contract(<any>ContractABI, process.env.CONTRACT_ADDRESS)

        const tx = await contract.methods.intentBookingBatch(
            parametros.idPublicacionContrato,
            parametros.fechaInicio.getDate(),
            parametros.fechaInicio.getMonth() + 1,
            parametros.fechaInicio.getFullYear(),
            parametros.fechaFin.getDate(),
            parametros.fechaFin.getMonth() + 1,
            parametros.fechaFin.getFullYear()
        )

        const room: Room = await contract.methods.rooms(parametros.idPublicacionContrato).call()

        const precioTotal = new BN(room.price).mul(new BN(parametros.dias()))

        await this.ejecutar(tx, billetera, web3, precioTotal);

        return {
            idReserva: parametros.idReserva,
            fechaInicio: parametros.fechaInicio.toISOString(),
            fechaFin: parametros.fechaFin.toISOString()
        }
    }

    private async ejecutar(tx: any, billetera: Billetera, web3: Web3, value: BN = new BN(0)): Promise<TransactionReceipt> {
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
