import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { DialogCambiarPasswordComponent } from './cambiar-assword/cambiar-password.dialog';
import { Usuario } from '../../models/old/usuario';
import Swal from 'sweetalert2';
import { DialogUsuarioComponent } from './dialogUpdate/usuario.dialog';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  visible: Boolean;

  criterioBusqueda: string;
  usuariosSource: Usuario[];
  usuario: Usuario;
  displayedColumns: string[] = ['Usuario', 'Apellido y Nombre', 'Correo', 'Roles', 'Acciones'];
  mouseOverIndex = -1;

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getListUsuarios();
  }

  public onMouseOver(index) {
    this.mouseOverIndex = index;
  }

  dialogoAgregar(): void {
    this.usuario = new Usuario();
    this.usuario.isEdit = false;
    const dialogRef = this.dialog.open(DialogUsuarioComponent, {
      disableClose: true,
      width: '85%',
      data: { data: this.usuario, visible: true }
    });
    dialogRef.afterClosed()
      .subscribe(result => {
        if (!(result == null)) {
          this.getListUsuarios();
        }
      });
  }

  editDialog(data: any): void {
    data.isEdit = true;
    this.usuario = data as Usuario;
    const dialogRef = this.dialog.open(DialogUsuarioComponent, {
      disableClose: true,
      width: '60%',
      data: { data: data, visible: false }
    });
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.getListUsuarios();
        }
      });
  }

  deleteDialog(data: any): void {
    Swal.fire({
      title: 'Notificación del sistema',
      text: 'Desea eliminar este registro de la base de datos?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.deleteUsuario((data as Usuario).user);
      }
    });
  }

  cambiarClave(): void {
    this.usuario = this.authService.usuario;

    console.log(this.usuario);

    const dialogRef = this.dialog.open(DialogCambiarPasswordComponent, {
      disableClose: true,
      width: '60%',
      data: {
        data: this.usuario,
        visible: false
      }
    });
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.getListUsuarios();
        }
      });
  }

  getListUsuarios(): void {
    this.usuariosSource = null;
    this.activatedRoute.paramMap.subscribe(params => {
      this.usuarioService.findAll()
        .subscribe((response: any) => {
          this.usuariosSource = response as Usuario[];
        });
    });
  }

  saveUsuario(usuario: Usuario) {
    usuario.version = 1;
    this.usuarioService.save(usuario)
      .subscribe(
        response => {
          Toast.fire({
            type: 'success',
            title: 'Usuario registrado exitosamente'
          });
          this.ngOnInit();
        }
      )
  }

  updateUsuario(parametro: Usuario): void {/*
    this.usuarioService.updateUsuario(parametro)
      .subscribe(response => {
        Toast.fire({
          type: 'success',
          title: 'Usuario actualizado exitosamente'
        });
        this.ngOnInit();
      })*/
  }

  deleteUsuario(user: string): void {/*
    this.usuarioService.deleteUsuarioByUsername(user)
      .subscribe(response => {
        Toast.fire({
          type: 'success',
          title: 'Usuario eliminado exitosamente'
        });
        this.ngOnInit();
      })*/
  }

  buscarUsuario(nombre: string) {/*
    if (nombre.length != 0) {
      this.usuarioService.findUsuarioByNombre(nombre)
        .subscribe(response => {
          this.usuariosSource = response as Usuario[];
        });
    } else {
      this.getListUsuarios();
    }*/
  }

  canAdd(): Boolean {
    return this.authService.isRoleAdmin();
  }

  canEdit(): Boolean {
    return this.authService.isRoleAdmin();
  }

  canDelete(): Boolean {
    return this.authService.isRoleAdmin();
  }

}
