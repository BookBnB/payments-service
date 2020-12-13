import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import { TransactionReceipt } from 'web3-eth';
import { abi as ContractABI } from "../../../src/contracts/BnBooking.json";
import Billetera from "../../domain/billeteras/entidades/Billetera";
import TransaccionRevertidaError from "../../domain/common/TransaccionRevertidaError";
import { IContratoBookBnB } from "../../domain/contratos/ContratoBookBnB";
import PublicacionDTO from "../../domain/publicaciones/dtos/PublicacionDTO";


export class ContratoBookBnB implements IContratoBookBnB {
    async crearPublicacion(precioPorNoche: number, billetera: Billetera): Promise<PublicacionDTO> {   
        const web3 = new Web3(
            new HDWalletProvider(billetera.palabras, process.env.NODE_URL)
        )

        const contract = new web3.eth.Contract(<any>ContractABI, process.env.CONTRACT_ADDRESS)
        const tx = await contract.methods.createRoom(precioPorNoche)

        const receipt = await this.ejecutar(tx, billetera, web3);

        const evento = receipt.events!.RoomCreated;

        return {
            direccionAnfitrion: evento.returnValues.owner,
            idEnContrato: parseInt(evento.returnValues.roomId),
            precioPorNoche: parseFloat(evento.returnValues.price)
        }
    }

    private async ejecutar(tx: any, billetera: Billetera, web3: Web3): Promise<TransactionReceipt> {
        try {
            return await tx.send({
                from: billetera.direccion,
                gasPrice: await web3.eth.getGasPrice(),
                gas: await tx.estimateGas()
            })
        } catch (err) {
            throw TransaccionRevertidaError.desdeError(err);
        }
    }
}
