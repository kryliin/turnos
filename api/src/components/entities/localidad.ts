import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import { Espacio } from "./espacio";

@Entity({ name: 'srt_localidades' })
export class Localidad extends AbstractEntity {

    @Column({ nullable: true })
    nombre: string;

    @Column({ nullable: true, name: 'codigo_postal' })
    codigoPostal: number;

    @OneToMany(type => Espacio, espacio => espacio.localidad)
    espacios: Espacio[];

    constructor(nombre: string, codigoPostal: number) {
        super();
        this.nombre = nombre;
        this.codigoPostal = codigoPostal;
    }


}
