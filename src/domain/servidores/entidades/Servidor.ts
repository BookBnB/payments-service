import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export interface ServidorConstructor {
    nombre: string
    token: string
}

@Entity()
export default class Servidor {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;
    
    @Column('text')
    public nombre!: string;

    @Column('text')
    public token!: string;

    @Column('boolean')
    public bloqueado: boolean = false;

    constructor(params: ServidorConstructor) {
        Object.assign(this, params)
    }

    bloquear() {
        this.bloqueado = true
    }

    desbloquear() {
        this.bloqueado = false
    }
}
