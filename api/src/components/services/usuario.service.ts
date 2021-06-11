import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario';
import { Repository } from 'typeorm';
import { UsuarioDto } from 'src/dto/usuario.dto';
import { AbstractService } from './abstract.service';
import { Role } from '../entities/role';
import { RoleService } from './role.service';

@Injectable()
export class UsuarioService extends AbstractService<Usuario> {

    constructor(
        public roleService: RoleService,
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>
    ) {
        super(usuarioRepository);
    }

    async getLogin(usuarioDto: UsuarioDto): Promise<any> {
        const user = usuarioDto.user;
        const pass = usuarioDto.pass;
        const usuario = await this.usuarioRepository.find({
            where: { user },
        });
        if (usuario && usuario[0].pass === pass) {
            return usuario;
        } else {
            return null;
        }

    }

    create(entity: any): Promise<any> {
        try {
            if (entity.roles) {
                let roles: Role[] = [];
                for (var role of entity.roles) {
                    this.roleService.get(role.id)
                        .then(entidadRecuperada => roles.push(entidadRecuperada));
                }
                entity.roles = roles;
                entity.version = 1;
                entity.fechaAlta = new Date();
                return new Promise<number>((resolve, reject) => {
                    this.usuarioRepository.save(entity)
                        .then(created => resolve(created))
                        .catch(err => reject(err));
                });
            } else {
                throw new BadGatewayException("Faltan Roles");
            }
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

}
