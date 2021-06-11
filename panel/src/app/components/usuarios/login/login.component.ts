import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../../models/old/usuario';

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000
});

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.style.css']
})
export class LoginComponent implements OnInit {

  usuario: Usuario = new Usuario();

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.usuario = new Usuario();
  }


  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      Swal.fire(
        'Login',
        `El usuario ${this.authService.usuario.user} ya está autenticado.`,
        'info'
      );
      this.router.navigate(['/starter']);
    }
  }


  login(): void {
    if (this.usuario.user == null || this.usuario.pass == null) {
      Swal.fire(
        'Error Login',
        'Username o password vacíos',
        'error'
      );
      return;
    }
    this.authService.login(this.usuario).subscribe(response => {
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      let usuario = this.authService.usuario;
      console.log("uuario", usuario);
      console.log("uuario", usuario);
      console.log("uuario", usuario);
      this.router.navigate(['/starter']);
    }, err => {
      Toast.fire({
        type: 'error',
        title: 'Las credenciales no son correctas. Reintentar!',
      });
    }
    );
  }

}
