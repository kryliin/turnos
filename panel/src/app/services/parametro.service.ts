import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Parametro } from '../models/parametro';
import { GenericService } from './generic.service';


@Injectable({
  providedIn: 'root'
})
export class ParametroService extends GenericService<Parametro> {

  private HEAD_ALERT: string = 'Notificación del sistema';
  private endpoint = this.api + 'parametros/';

  constructor(
    public http: HttpClient
  ) {
    super(http, 'parametros/');
  }

  // GET JSON Parametro by id
  findParametroById(id: string): Observable<any> {
    const path = `${this.api}${id}`;
    return this.http.get<any>(path).pipe(
      catchError(e => {
        Swal.fire(
          this.HEAD_ALERT,
          e.error.mensaje,
          'error');
        return throwError(e);
      })
    );
  }

  /*
  private api = environment.API_URL + 'GOS/api/parametros/';
  private httpHeaders = new HttpHeaders({ 'Context-Type': 'application/json' });
  private HEAD_ALERT: string = 'Notificación del sistema';

  // constructor, with inject dependence
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // GET JSON ALL Parametros
  findParametroAll(): Observable<Parametro[]> {
    const path = `${this.api}`;
    return this.http.get(path).pipe(
      map((response: any) => response.parametros as Parametro[])
    );
  }

  // GET JSON Parametro by id
  findParametroById(id: string): Observable<any> {
    const path = `${this.api}${id}`;
    return this.http.get<any>(path).pipe(
      catchError(e => {
        this.router.navigate(['/parametros']);
        console.error(e.error.mensaje)
        Swal.fire(
          this.HEAD_ALERT,
          e.error.mensaje,
          'error');
        return throwError(e);
      })
    );
  }

  // POST JSON Especialidad
  saveParametro(parametro: Parametro): Observable<any> {
    const path = `${this.api}`;
    return this.http.post<any>(path, parametro, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(
          this.HEAD_ALERT,
          e.error.mensaje,
          'error');
        return throwError(e);
      })
    );
  }

  // PUT JSON Parametro
  updateParametro(parametro: Parametro): Observable<any> {
    const path = `${this.api}${parametro.clave}`;
    return this.http.put<any>(path, parametro, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(
          this.HEAD_ALERT,
          e.error.mensaje,
          'error');
        return throwError(e);
      })
    );
  }

*/

}
