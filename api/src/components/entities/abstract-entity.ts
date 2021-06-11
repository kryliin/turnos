import { Column, PrimaryGeneratedColumn } from "typeorm";

export class AbstractEntity {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'int' })
    version: number;

    @Column({ type: 'datetime', name: 'fecha_alta' })
    fechaAlta: Date;

    @Column({ type: 'datetime', name: 'fecha_modificacion', nullable: true })
    fechaModificacion: Date;

    @Column({ type: 'datetime', name: 'fecha_baja', nullable: true })
    fechaBaja: Date;

    constructor() {
        this.fechaAlta = new Date();
        this.version = 1;
    }
}
