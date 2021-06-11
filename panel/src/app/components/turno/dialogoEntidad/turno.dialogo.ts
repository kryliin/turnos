import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import Swal from 'sweetalert2';
import { Espacio } from '../../../models/espacio';
import { Turno } from '../../../models/turno';
import { EspacioService } from '../../../services/espacio.service';
import { TurnoService } from '../../../services/turno.service';

const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000
});

@Component({
    selector: 'dialogo-turno',
    templateUrl: './turno.dialogo.html'
})

export class DialogoTurno {

    espacios: Espacio[];

    constructor(
        public dialogRef: MatDialogRef<DialogoTurno>,
        private espacioService: EspacioService,
        private turnoService: TurnoService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.obtenerEspacios();
    }

    ngOnInit() {

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    obtenerEspacios() {
        this.espacioService.findAll().subscribe((response: any) => {
            console.log();
            this.espacios = response as Espacio[];
        });
    }

    save(turno: Turno): void {
        if (this.validate(turno)) {
            this.turnoService.save(turno)
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

    validate(turno: Turno): Boolean {
        let error = new Array<string>();
        if (!turno.espacio) { error.push(" El Espacio es requerido") }
        if (!turno.nombre) { error.push(" El Nombre es requerido") }
        if (!turno.fechaInicio) { error.push(" La fecha inicio es requerida") }
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