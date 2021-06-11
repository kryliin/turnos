import { IsNotEmpty, IsString } from "class-validator";

export class ReservaReseponse {

    @IsNotEmpty()
    @IsString()
    codigoReserva: string;

    constructor(codigoReserva: string) {
        this.codigoReserva = codigoReserva;
    }
}
