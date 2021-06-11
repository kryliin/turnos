import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import Swal from 'sweetalert2';
import { Espacio } from '../../../models/espacio';
import { Localidad } from '../../../models/localidad';
import { Tipo } from '../../../models/tipo';
import { EspacioService } from '../../../services/espacio.service';
import { LocalidadService } from '../../../services/localidad.service';
import { TipoService } from '../../../services/tipo.service';

const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000
});

@Component({
    selector: 'dialogo-espacio',
    templateUrl: './espacio.dialogo.html'
})

export class DialogoEspacio {

    tipos: Tipo[];
    localidades: Localidad[];

    constructor(
        public dialogRef: MatDialogRef<DialogoEspacio>,
        private tipoService: TipoService,
        private espacioService: EspacioService,
        private localidadService: LocalidadService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.obtenerLocalidades();
        this.obtenerTipos();
    }

    ngOnInit() {

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    obtenerTipos() {
        this.tipoService.findAll().subscribe((response: any) => {
            this.tipos = response as Tipo[];
        });
    }

    obtenerLocalidades() {
        this.localidadService.findAll().subscribe((response: any) => {
            console.log();
            this.localidades = response as Localidad[];
        });
    }

    save(espacio: Espacio): void {
        if (this.validate(espacio)) {
            this.espacioService.save(espacio)
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


    validate(espacio: Espacio): Boolean {
        let error = new Array<string>();
        if (!espacio.nombre) { error.push(" El Nombre es requerido") }
        if (!espacio.localidad) { error.push(" La localidad es requerida") }
        if (!espacio.fechaInicio) { error.push(" La fecha inicio es requerida") }
        if (!espacio.tipo) { error.push(" El ripo es requerido") }

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