import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import { Persona } from "./persona";
import { Sector } from "./sector";

@Entity({ name: 'srt_reservas' })
export class Reserva extends AbstractEntity {

    @Column({ type: 'varchar', name: 'codigo_reserva', nullable: true })
    codigoReserva: string;

    @Column({ type: 'varchar', name: 'patente', nullable: true })
    patente: string;

    @Column({ type: 'date', name: 'fecha_ingreso', nullable: true })
    fechaIngreso: Date;

    @Column({ type: 'varchar', name: 'correo', nullable: true })
    correo: string;

    @Column({ type: 'varchar', name: 'telefono', nullable: true })
    telefono: string;

    @Column({ type: 'date', name: 'fecha_reserva' })
    fechaReserva: Date;

    @ManyToOne(type => Persona, persona => persona.reservas, {
        nullable: false, eager: true,
    })
    persona: Persona;

    @ManyToOne(type => Sector, sector => sector.reservas, {
        nullable: false, eager: true,
    })
    sector: Sector;

    @Column({ type: 'varchar', name: 'usuario', nullable: true })
    usuario: string;

    constructor(patente: string, correo: string, telefono: string, fechaReserva: Date, persona: Persona, sector: Sector, usuario: string) {
        super();
        this.patente = patente;
        this.correo = correo;
        this.telefono = telefono;
        this.fechaReserva = fechaReserva;
        this.persona = persona;
        this.sector = sector;
        this.usuario = usuario;
    }

}
