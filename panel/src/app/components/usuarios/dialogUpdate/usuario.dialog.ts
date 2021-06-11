import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../../models/old/usuario';
import { Role } from '../../../models/old/role';

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
    templateUrl: './usuario.dialog.html'
})

export class DialogUsuarioComponent implements OnInit {

    confirmPassword: string;
    myForm: FormGroup;
    hide = true;
    isEdit = false;
    matcher = new MyErrorStateMatcher();
    usuario: Usuario;
    rols: Role[];
    toppings = new FormControl();
    roles: string[] = [Role.ROLE_ADMIN, Role.ROLE_USER];

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        public dialogRef: MatDialogRef<DialogUsuarioComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        if (this.data.data.isEdit) {
            this.isEdit = true;
            this.usuario = this.data.data;
            this.setRoles(this.usuario);
        } else {
            this.isEdit = false;
        }
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

    setRoles(usuario: Usuario): void {
        var array: string[] = [];
        usuario.roles.forEach(element => {
            array.push(element.nombre);
        });
        this.toppings.setValue([...array]);
    }

    save() {
        this.usuario = this.data.data;
        var array: Role[] = [];
        this.toppings.value.forEach(element => {
            var unRol = new Role();
            unRol.nombre = element;
            array.push(unRol);
        });
        this.usuario.roles = [...array];
        if (this.data.isEdit) {
            this.updateUsuario(this.usuario);
        } else {
            this.saveUsuario(this.usuario);
        }
    }

    saveUsuario(usuario: Usuario): void {
        this.usuarioService.save(usuario)
            .subscribe(
                response => {
                    Toast.fire({
                        type: 'success',
                        title: 'Usuario registrado exitosamente'
                    });
                    this.dialogRef.close(this.data);
                }
            )
    }

    updateUsuario(usuario: Usuario): void {
        /*
        this.usuarioService.updateUsuario(usuario)
            .subscribe(response => {
                Toast.fire({
                    type: 'success',
                    title: 'Usuario actualizado exitosamente'
                });
                this.dialogRef.close(this.data);
            })*/
    }

    checkPasswords(group: FormGroup) {
        const pass = group.controls.password.value;
        const confirmPass = group.controls.confirmPassword.value;

        return pass === confirmPass ? null : { notSame: true };
    }
}
