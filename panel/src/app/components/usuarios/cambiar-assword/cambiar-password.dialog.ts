import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';
import { Clave } from '../../../models/old/clave';
import { Role } from '../../../models/old/role';
import { Usuario } from '../../../models/old/usuario';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
        const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

        return (invalidCtrl || invalidParent);
    }
}


@Component({
    selector: 'app-dialog-overview-example-dialog',
    templateUrl: './cambiar-password.dialog.html'
})

export class DialogCambiarPasswordComponent implements OnInit {

    confirmPassword: string;
    myForm: FormGroup;
    hide = true;
    matcher = new MyErrorStateMatcher();
    usuario: Usuario;
    rols: Role[];
    toppings = new FormControl();
    roles: string[] = [Role.ROLE_ADMIN, Role.ROLE_USER];

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        public dialogRef: MatDialogRef<DialogCambiarPasswordComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.usuario = this.data.data;
        this.myForm = this.formBuilder.group({
            password: ['', [Validators.required]],
            confirmPassword: ['']
        }, { validator: this.checkPasswords });

    }

    ngOnInit() {
        if (!this.data.data) {
            this.data.data = {};
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }


    save() {
        let clave = new Clave();
        clave.username = this.data.data.username;
        clave.claveNueva = this.data.data.password;
        /*
        this.usuarioService.cambiarClave(clave)
            .subscribe(response => {
                Toast.fire({
                    type: 'success',
                    title: 'La contraseña ha sido cambiada exitosamente'
                });
                this.dialogRef.close(this.data);
            })
*/
    }

    checkPasswords(group: FormGroup) {
        const pass = group.controls.password.value;
        const confirmPass = group.controls.confirmPassword.value;

        return pass === confirmPass ? null : { notSame: true };
    }

}
