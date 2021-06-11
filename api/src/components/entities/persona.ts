import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import { Reserva } from "./reserva";

export enum TipoDocumento {
    DNI,
    PASAPORTE,
    OTRO
}

@Entity({ name: 'srt_personas' })
export class Persona extends AbstractEntity {

    @Column({ type: 'int', name: 'tipo_documento' })
    tipoDocumento: TipoDocumento;

    @Column({ type: 'varchar', name: 'sexo' })
    sexo: string;

    @Column({ type: 'varchar', name: 'numero_documento' })
    numeroDocumento: string;

    @Column({ type: 'varchar', name: 'numero_tramite' })
    numeroTramite: string;

    @Column({ type: 'varchar', name: 'string_documento', nullable: true })
    stringDocumento: string;

    @OneToMany(type => Reserva, reserva => reserva.persona)
    reservas: Reserva[];

    constructor(tipoDocumento: TipoDocumento, sexo: string, numeroDocumento: string, numeroTramite: string) {
        super();
        this.sexo = sexo;
        this.tipoDocumento = tipoDocumento;
        this.numeroTramite = numeroTramite;
        this.numeroDocumento = numeroDocumento;
    }

}
