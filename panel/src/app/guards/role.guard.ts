import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    const role = next.data['authorities'] as string;

    if (this.authService.hasRole(role.toString())) {
      return true;
    } else {
      Swal.fire(
        'Acceso denegado',
        `El usuario ${this.authService.usuario.user} no tienes acceso a este recurso.`,
        'warning'
      );
      this.router.navigate(['/starter']);
      return false;
    }

  }
}
