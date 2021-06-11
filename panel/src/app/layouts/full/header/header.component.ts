import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Usuario } from '../../../models/old/usuario';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {

  usuario: Usuario;

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    private route: Router
  ) {

  }


  logout(): void {
    this.authService.logout();
    this.route.navigate(['/login']);
  }

  /*
  cambiarClave(): void {
    this.usuario = new Usuario();
    const dialogRef = this.dialog.open(DialogCambiarClaveComponent, {
      disableClose: true,
      width: '85%',
      data: {
        usuario: this.usuario, visible: true
      }
    });
    dialogRef.afterClosed()
      .subscribe(result => {
        if (!(result == null)) {
          //this.saveUsuario(result as Usuario);
        }
      });
  }
*/


  configuracion(): void {
    this.authService.logout();
    this.route.navigate(['/parametros']);
  }

}
