
export class DisponibilidadReseponse {
    fecha: Date;
    listaEspacios: DisponibilidadEspaciosReseponse[] = [];
    cantidadTotalReservas = 0;
}

// tslint:disable-next-line: max-classes-per-file
export class DisponibilidadEspaciosReseponse {
    idEspacio: number;
    nombre: string;
    listaTurnos: DisponibilidadTurnosReseponse[] = [];
    listaSectores: SectoresReseponse[] = [];
}

// tslint:disable-next-line: max-classes-per-file
export class DisponibilidadTurnosReseponse {
    idTurno: number;
    nombre: string;
    cupoMaximo = 0;
    cantidadReservas = 0;
    cantidadIngresados = 0;
}

// tslint:disable-next-line: max-classes-per-file
export class SectoresReseponse {
    idSector: number;
    nombre: string;
}
