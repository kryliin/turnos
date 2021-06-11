import { Localidad } from "./localidad";
import { Sector } from "./sector";
import { Tipo } from "./tipo";
import { Turno } from "./turno";

export class Espacio {
    id: number;
    nombre: string;
    fechaInicio: Date;
    fechaFin: Date;
    logo: string;
    direccion: string;
    telefono: string;
    tipo: Tipo;
    localidad: Localidad;
    sectores: Sector[];
    turnos: Turno[];
}
