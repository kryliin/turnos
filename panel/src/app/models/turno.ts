import { Espacio } from "./espacio";
import { Sector } from "./sector";

export class Turno {
    id: number;
    nombre: string;
    fechaInicio: Date;
    fechaFin: Date;
    espacio: Espacio;
    sectores: Sector[];

}
