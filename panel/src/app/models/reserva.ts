import { Persona } from "./persona";
import { Sector } from "./sector";

export class Reserva {
    id: number;
    codigoReserva: string;
    fechaReserva: Date;
    persona: Persona;
    sector: Sector;
    fechaIngreso: Date;
    fechaBaja: Date;
    usuario: string;
}
