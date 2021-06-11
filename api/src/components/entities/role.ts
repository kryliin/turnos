import { Entity, Column, ManyToMany } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import { Usuario } from "./usuario";

@Entity({ name: 'srt_roles' })
export class Role extends AbstractEntity {

    @Column({ nullable: false })
    nombre: string;

    @ManyToMany(() => Usuario, (usuario: Usuario) => usuario.roles)
    usuarios: Promise<Usuario[]>;

}
