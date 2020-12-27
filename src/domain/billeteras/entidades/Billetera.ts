import { Column, Entity, PrimaryColumn} from "typeorm";

interface BilleteraConstructor {
    usuarioId: string
    direccion: string
    palabras: string
}

@Entity()
export default class Billetera {
    @PrimaryColumn('uuid')
    public usuarioId!: string;

    @Column()
    public direccion!: string;

    @Column()
    public palabras!: string;

    constructor(args: BilleteraConstructor) {
        Object.assign(this, args);
    }
}
