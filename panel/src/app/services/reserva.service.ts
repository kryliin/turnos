import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reserva } from '../models/reserva';
import { GenericService } from './generic.service';
import Swal from 'sweetalert2';
import { Usuario } from '../models/old/usuario';

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000
});

@Injectable({
  providedIn: 'root'
})
export class ReservaService extends GenericService<Reserva> {

  private endpoint = this.api + 'reserva/';

  constructor(
    public http: HttpClient
  ) {
    super(http, 'reserva/');
  }

  checkIn(request: Reserva[]): Observable<any> {
    if (request) {
      const reservas = this.addCurrentUser(request);

      console.log('RESERVAS CONFIRMADAS');
      console.log(reservas);

      const path = `${this.api}reserva/playa/checkin`;
      return this.http.post<any>(path, request, { headers: this.httpClientHeaders })
        .pipe(
          catchError(e => {
            Toast.fire({
              type: 'error',
              title: e.error.message
            });
            return throwError(e);
          })
        );
    }
  }

  addCurrentUser(reservas: Reserva[]): Reserva[] {
    let reservasReturn = new Array<Reserva>();
    if (reservas) {
      const usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      reservas.forEach(reserva => {
        reserva.usuario = usuario.user;
        reservasReturn.push(reserva);
      });
    }
    return reservasReturn;
  }

}
