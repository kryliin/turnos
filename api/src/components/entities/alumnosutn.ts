import { Column, Entity } from "typeorm";
import { AbstractEntity } from "./abstract-entity";

@Entity({ name: 'srt_alumnosutn' })
export class AlumnosUtn {

    @Column({ type: 'varchar', name: 'apellidos', length: 255 })
    apellidos: string;

    @Column({ type: 'varchar', name: 'nombres' , length: 255})
    nombres: string;

    @Column({ type: 'varchar', name: 'tipodni', length: 255})
    tipodni: string;

    @Column({ type: 'varchar', name: 'dni', length: 255})
    dni: string;

    @Column({ type: 'varchar', name: 'email', length: 255 })
    email: string;

    @Column({ type: 'int', name: 'usuario'})
    usuario: number;

    constructor(apellidos: string, value: string, nombres: string, tipodni: string, dni: string,
        email: string, usuario: number) {
        this.apellidos = apellidos;
        this.nombres = nombres;
        this.tipodni = tipodni;
        this.dni = dni;
        this.email = email;
        this.usuario = usuario;
    }


}
