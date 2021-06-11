import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioDto } from 'src/dto/usuario.dto';
import { UsuarioService } from 'src/components/services/usuario.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usuarioService: UsuarioService
    ) { }

    async signInPanel(adminDto: UsuarioDto): Promise<{ access_token: string }> {
        const { user, pass } = adminDto;
        let access_token = '';
        const result = await this.usuarioService.getLogin(adminDto);
        let usuario;
        if (result) {
            usuario = result[0];
        }
        let roles = new Array<string>();
        if (usuario.roles) {
            usuario.roles.forEach(rol => {
                roles.push(rol.nombre)
            });
        }
        if (usuario.id) {
            access_token = await this.jwtService.sign({ user, pass, roles });
        }
        return { access_token };
    }

    async signInTokenPublic(dni: string): Promise<string> {
        let access_token = '';
        if (dni) {
            access_token = await this.jwtService.sign({ dni });
            return access_token;
        } else {
            throw new ForbiddenException('Error al obtener el token');
        }
    }

}