import { sign } from "crypto";
import { Column, Entity, ManyToOne, OneToMany, SimpleConsoleLogger } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import { Espacio } from "./espacio";
import { Sector } from "./sector";

@Entity({ name: 'srt_turnos' })
export class Turno extends AbstractEntity {

    @Column({ type: 'varchar', name: 'nombre' })
    nombre: string;

    @Column({ type: 'datetime', name: 'fecha_inicio' })
    fechaInicio: Date;

    @Column({ type: 'datetime', name: 'fecha_fin', nullable: true })
    fechaFin: Date;

    @ManyToOne(type => Espacio, espacio => espacio.turnos, {
        eager: true, nullable: false,
    })
    espacio: Espacio;

    @OneToMany(type => Sector, sector => sector.turno)
    sectores: Sector[];

    constructor(nombre: string, fechaInicio: Date, fechaFin: Date, espacio: Espacio) {
        super();
    }


}
