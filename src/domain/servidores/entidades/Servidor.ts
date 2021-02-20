import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export interface ServidorConstructor {
    nombre: string
    token: string
}

@Entity()
export default class Servidor {
    @PrimaryGeneratedColumn()
    public id?: string;
    
    @Column('text')
    public nombre!: string;

    @Column('text')
    public token!: string;

    constructor(params: ServidorConstructor) {
        Object.assign(this, params)
    }
}
