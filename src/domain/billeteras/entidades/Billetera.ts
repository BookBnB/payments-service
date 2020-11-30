import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

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