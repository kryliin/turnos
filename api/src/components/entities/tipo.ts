import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import { Espacio } from "./espacio";

@Entity({ name: 'srt_tipos' })
export class Tipo extends AbstractEntity {

    @Column({ type: 'varchar', name: 'nombre' })
    nombre: string;

    @OneToMany(type => Espacio, espacio => espacio.tipo)
    espacios: Espacio[];
}
