import HDWalletProvider from "@truffle/hdwallet-provider";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import Web3 from "web3";

interface BilleteraConstructor {
    idUsuario: string
    direccion: string
    palabras: string
}

@Entity()
export default class Billetera {
    @PrimaryColumn('uuid')
    public idUsuario!: string;

    @Column()
    public direccion!: string;

    @Column()
    public palabras!: string;

    constructor(args: BilleteraConstructor) {
        Object.assign(this, args);
    }
}