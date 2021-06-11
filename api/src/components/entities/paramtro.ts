import { Entity, Column } from "typeorm";
import { AbstractEntity } from "./abstract-entity";

@Entity({ name: 'srt_parametros' })
export class Parametro extends AbstractEntity {

    @Column({ unique: true })
    key: string;

    @Column({ nullable: false })
    value: string;

    @Column({ nullable: false })
    observacion: string;

    constructor(key: string, value: string, observacion: string) {
        super();
        this.key = key;
        this.value = value;
        this.observacion = observacion;
    }
}