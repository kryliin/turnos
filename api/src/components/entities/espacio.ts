import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import { Localidad } from "./localidad";
import { Sector } from "./sector";
import { Tipo } from "./tipo";
import { Turno } from "./turno";

@Entity({ name: 'srt_espacios' })
export class Espacio extends AbstractEntity {

    @Column({ type: 'varchar', name: 'nombre', length: 255 })
    nombre: string;

    @Column({ type: 'datetime', name: 'fecha_inicio' })
    fechaInicio: Date;

    @Column({ type: 'datetime', name: 'fecha_fin', nullable: true })
    fechaFin: Date;

    @Column({ type: 'varchar', name: 'logo', length: 255, nullable: true })
    logo: string;

    @Column({ type: 'varchar', name: 'direccion', length: 255, nullable: true })
    direccion: string;

    @Column({ type: 'varchar', name: 'telefono', length: 255, nullable: true })
    telefono: string;

    @ManyToOne(type => Tipo, tipo => tipo.espacios, {
        eager: true, nullable: false,
    })
    tipo: Tipo;

    @ManyToOne(type => Localidad, localidad => localidad.espacios, {
        nullable: false,
    })
    localidad: Localidad;

    @OneToMany(type => Sector, sector => sector.espacio)
    sectores: Sector[];

    @OneToMany(type => Turno, turno => turno.espacio)
    turnos: Turno[];

    constructor(nombre: string, fechaInicio: Date, fechaFin: Date, logo: string,
        direccion: string, telefono: string, localidad: Localidad, tipo: Tipo) {
        super();
        this.nombre = nombre;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.logo = logo;
        this.direccion = direccion;
        this.telefono = telefono;
        this.localidad = localidad;
        this.tipo = tipo;
    }

}
