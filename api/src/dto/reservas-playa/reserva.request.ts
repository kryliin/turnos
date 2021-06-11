import { ValidadorRequest } from "./validador.request";

export class ReservaRequest {
    idEspacio: number;
    idSector: number;
    idTurno: number;
    patente: string;
    correo: string;
    telefono: string;
    fechaReserva: Date;
    listaDNI: ValidadorRequest[];
}
