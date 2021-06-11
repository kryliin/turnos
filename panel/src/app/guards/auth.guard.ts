/** 
 *  Route Guard es unainterface que puede decirle al enrutador si debe o no permitir 
 *  la navegación a una ruta solicitada.
 * 
 * Permite acceder a los modulos de la aplicacion, solo si esta autenticado.
 *
 *  Tiene que existe un JWT en el localstore y que sea valido (tiempo).
 *  Guard
 * 
 *  CanActivate: Mira si el usuario puede acceder a una página determinada.
 * 
 * Se inyectan dos servicios:
 * - AuthService      para comprabar si el usuario esta logueado.
 * - Router           para redirigir el login si el usuaro no esta logueado.
 * 
 */

import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // return true;
    if (this.authService.isAuthenticated()) {
      /*
      if (this.isTokenExpirado()) {
        this.authService.logout();
        this.router.navigate(['/login']);
        return false;
      }
      */
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }


  isTokenExpirado(): boolean {
    let token = this.authService.token;
    let payload = this.authService.obtenerDatosToken(token);
    let now = new Date().getTime() / 1000;
    if (payload.exp < now) {
      return true;
    }
    return false;
  }

}