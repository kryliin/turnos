import { Reserva } from "./reserva";

export enum TipoDocumento {
    DNI,
    PASAPORTE,
    OTRO
}
export class Persona {
    id: number;
    tipoDocumento: TipoDocumento;
    numeroDocumento: string;
    stringDocumento: string;
    reservas: Reserva[];
}
