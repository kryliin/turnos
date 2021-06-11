import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Tipo } from '../../../models/tipo';
import Swal from 'sweetalert2';
import { TipoService } from '../../../services/tipo.service';

const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000
});

@Component({
    selector: 'dialogo-tipo',
    templateUrl: './tipo.dialogo.html'
})

export class DialogoTipo {

    constructor(
        private tipoService: TipoService,
        public dialogRef: MatDialogRef<DialogoTipo>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() {

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    save(tipo: Tipo): void {
        if (this.validate(tipo)) {
            this.tipoService.save(tipo)
                .subscribe(
                    response => {
                        Toast.fire({
                            type: 'success',
                            title: 'Entidad agregada exitosamente'
                        });
                    }
                );
            this.dialogRef.close();
        }
    }

    validate(tipo: Tipo): Boolean {
        let error = new Array<string>();
        if (!tipo.nombre) { error.push(" El Nombre es requerido") }
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