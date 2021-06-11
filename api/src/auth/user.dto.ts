import { IsNumberString, IsNotEmpty } from "class-validator";

export class UserDto {

    @IsNumberString()
    @IsNotEmpty()
    dni: string;

}

export class UserResponseDto {

    id: number;
    nombre: string;
    dni: string;
    telefono: string;
    mail: string;
    aceptaTerminos: boolean;
    idReferencia: string;
}
