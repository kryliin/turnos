import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import { Espacio } from "./espacio";
import { Reserva } from "./reserva";
import { Turno } from "./turno";

@Entity({ name: 'srt_sectores' })
export class Sector extends AbstractEntity {

    @Column({ type: 'varchar', name: 'nombre' })
    nombre: string;

    @Column({ type: 'datetime', name: 'fecha_inicio' })
    fechaInicio: Date;

    @Column({ type: 'datetime', name: 'fecha_fin', nullable: true })
    fechaFin: Date;

    @Column({ type: 'varchar', name: 'logo', nullable: true })
    logo: string;

    @Column({ type: 'int', name: 'cupo_maximo' })
    cupoMaximo: number;

    @ManyToOne(type => Turno, turno => turno.sectores, {
        eager: true, nullable: false,
    })
    turno: Turno;

    @ManyToOne(type => Espacio, espacio => espacio.sectores, {
        eager: true, nullable: false,
    })
    espacio: Espacio;

    @OneToMany(type => Reserva, reserva => reserva.sector)
    reservas: Reserva[];

    constructor(nombre: string, fechaInicio: Date, fechaFin: Date, logo: string, cupoMaximo: number, turno: Turno, espacio: Espacio) {
        super();
        this.nombre = nombre;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.logo = logo;
        this.cupoMaximo = cupoMaximo;
        this.turno = turno;
        this.espacio = espacio;
    }

}
