import { IsHexadecimal } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import Billetera from "../../billeteras/entidades/Billetera";


export enum EventoReserva {
    CREACION = 'creacion',
    APROBACION = 'aprobacion',
    RECHAZO = 'rechazo'
}

@Entity()
export default class TransaccionReserva {
    @PrimaryGeneratedColumn()
    public recordId?: number;
    
    @IsHexadecimal()
    @Column("varchar", { nullable: true })
    public hash?: string;

    @Column('text')
    public reservaId!: string;

    @Column('text')
    public evento!: EventoReserva;

    @ManyToOne(type => Billetera)
    public emisor!: Billetera;

    @CreateDateColumn()
    public fecha?: Date;

    @Column('boolean')
    public exito!: boolean;
}
