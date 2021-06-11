import { AbstractFiltros } from "./abstract.filtros";

export class ReservaFiltros extends AbstractFiltros {
    idSector: number;
    fecha: Date;
    numeroDocumento: string;
    codigoReserva: string;
}
