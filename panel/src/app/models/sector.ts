import { Espacio } from "./espacio";
import { Reserva } from "./reserva";
import { Turno } from "./turno";

export class Sector {
    id: number;
    nombre: string;
    fechaInicio: Date;
    fechaFin: Date;
    logo: string;
    cupoMaximo: number;
    turno: Turno;
    espacio: Espacio;
    reservas: Reserva[];
}
