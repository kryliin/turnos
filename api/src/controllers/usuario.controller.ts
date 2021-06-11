import { Controller } from '@nestjs/common';
import { Usuario } from 'src/components/entities/usuario';
import { UsuarioService } from 'src/components/services/usuario.service';
import { AbstractController } from './abstract.controller';

@Controller('usuario')
export class UsuarioController extends AbstractController<Usuario> {

    constructor(private readonly usuarioService: UsuarioService) {
        super(usuarioService);
    }

}
