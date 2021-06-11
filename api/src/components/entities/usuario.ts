import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import { Role } from "./role";

@Entity({ name: 'srt_usuarios' })
export class Usuario extends AbstractEntity {

    @Column({ nullable: false })
    user: string;

    @Column({ nullable: false })
    pass: string;

    @Column({ nullable: false })
    nombre: string;

    @Column({ nullable: false })
    apellido: string;

    @Column({ nullable: false })
    email: string;

    @ManyToMany(type => Role, { cascade: true, eager: true })
    @JoinTable({
        name: 'srt_usuarios_roles',
        joinColumn: { name: 'usuario_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'roles_id', referencedColumnName: 'id' },
    })
    roles: Role[];
}
