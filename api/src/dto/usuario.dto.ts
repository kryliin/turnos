import { IsNotEmpty } from "class-validator";

export class UsuarioDto {

    @IsNotEmpty()
    user: string;

    @IsNotEmpty()
    pass: string;

}