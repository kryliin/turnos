import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import Swal from 'sweetalert2';
import { Espacio } from '../../../models/espacio';
import { Sector } from '../../../models/sector';
import { Turno } from '../../../models/turno';
import { EspacioService } from '../../../services/espacio.service';
import { SectorService } from '../../../services/sector.service';
import { TurnoService } from '../../../services/turno.service';

const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000
});

@Component({
    selector: 'dialogo-sector',
    templateUrl: './sector.dialogo.html'
})

export class DialogoSector {

    turnos: Turno[];
    espacios: Espacio[];

    constructor(
        public dialogRef: MatDialogRef<DialogoSector>,
        private turnoService: TurnoService,
        private sectorService: SectorService,
        private espacioService: EspacioService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.obtenerLocalidades();
        this.obtenerEspaios();
    }

    ngOnInit() {

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    obtenerLocalidades() {
        this.turnoService.findAll().subscribe((response: any) => {
            console.log();
            this.turnos = response as Turno[];
        });
    }

    obtenerEspaios() {
        this.espacioService.findAll().subscribe((response: any) => {
            console.log();
            this.espacios = response as Espacio[];
        });
    }

    save(sector: Sector): void {
        if (this.validate(sector)) {
            this.sectorService.save(sector)
                .subscribe(
                    response => {
                        Toast.fire({
                            type: 'success',
                            title: 'Entidad agregada exitosamente'
                        });
                        this.dialogRef.close();
                    }
                );
        }
    }


    validate(sector: Sector): Boolean {
        let error = new Array<string>();
        if (!sector.nombre) { error.push(" El Nombre es requerido") }
        if (!sector.espacio) { error.push(" El Espacio es requerido") }
        if (!sector.fechaInicio) { error.push(" La fecha inicio es requerida") }
        if (!sector.turno) { error.push(" El turno es requerido") }
        if (!sector.cupoMaximo) { error.push(" El cupo maximo es requerido") }

        if (error.length > 0) {
            const mensaje = error.toString() as string;
            Swal.fire({
                title: 'Faltan datos requeridos',
                text: mensaje,
            })
            return false;
        } else { return true }
    }

}