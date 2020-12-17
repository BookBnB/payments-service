import HDWalletProvider from "@truffle/hdwallet-provider";
import { entropyToMnemonic } from "bip39";
import Web3 from "web3";
import Billetera from "../../domain/billeteras/entidades/Billetera";
import { ICreadorBilleteras } from "../../domain/billeteras/servicios/CreadorBilleteras";
import UUID from "../../domain/common/entidades/UUID";

export default class CreadorBilleteras implements ICreadorBilleteras {
    async crear(id: UUID): Promise<Billetera> {
        const mnemonic = entropyToMnemonic(
            (Math.random() * 10000000000000000000).toString().split('.')[0].padStart(32, '0')
        );

        const provider = new HDWalletProvider(mnemonic, process.env.NODE_URL);
        const web3 = new Web3(provider);
        const currentAccounts = await web3.eth.getAccounts();

        return new Billetera({
            usuarioId: id.id,
            palabras: mnemonic,
            direccion: currentAccounts[0]
        });
    }
}