import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { AbstractFiltros } from '../models/filter/abstract.filtros';

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000
});

export abstract class GenericService<T> {

  public api = environment.API_URL;
  public httpClientHeaders = new HttpHeaders({ 'Context-Type': 'application/json' });

  constructor(
    private httpClient: HttpClient,
    private endPoint: string
  ) { }

  findAll(): Observable<T | T[]> {
    const path = `${this.api}${this.endPoint}`;
    return this.httpClient.get(path)
      .pipe(
        map((response: any) => response as T)
      );
  }

  findAllPageable(page: number): Observable<any> {
    const path = `${this.api}${this.endPoint}` + 'page/' + page;
    return this.httpClient.get(path)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  findById(id: number): Observable<any> {
    if ((!isNaN(id) || !isNullOrUndefined(id)) && id >= 0) {
      const path = `${this.api}${this.endPoint}`;
      return this.httpClient.get<any>(path, { headers: this.httpClientHeaders }).pipe(
        catchError(e => {
          console.log("Error: " + e);
          Toast.fire({
            type: 'error',
            title: e.error.message
          });
          return throwError(e);
        })
      );
    }
  }

  findByFiltro(filtros: AbstractFiltros): Observable<any> {
    if (!isNullOrUndefined(filtros)) {
      const path = `${this.api}${this.endPoint}playa/filtros`;
      return this.httpClient.post<any>(path, filtros, { headers: this.httpClientHeaders }).pipe(
        catchError(e => {
          console.log("Error: " + e);
          Toast.fire({
            type: 'error',
            title: e.error.message
          });
          return throwError(e);
        })
      );
    }
  }

  save(request: T): Observable<any> {
    if (request) {
      const path = `${this.api}${this.endPoint}`;
      return this.httpClient.post<any>(path, request, { headers: this.httpClientHeaders })
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

  update(request: T): Observable<any> {
    const path = `${this.api}${this.endPoint}`;
    return this.httpClient.put<any>(path, request, { headers: this.httpClientHeaders })
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

  deleteById(id: number): Observable<any> {
    const path = `${this.api}${this.endPoint}${id}`;
    return this.httpClient.delete<any>(path, { headers: this.httpClientHeaders }).pipe(
      catchError(e => {
        console.error(e.error.message);
        Toast.fire({
          type: 'error',
          title: e.error.message
        });
        return throwError(e);
      })
    );
  }


}
