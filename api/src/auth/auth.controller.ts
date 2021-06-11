import { Controller, Post, UsePipes, ValidationPipe, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuarioDto } from 'src/dto/usuario.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/token')
    @UsePipes(ValidationPipe)
    async signInPanel(@Body() adminDto: UsuarioDto) {
        return this.authService.signInPanel(adminDto);
    }
}
