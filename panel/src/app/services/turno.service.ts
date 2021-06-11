import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Turno } from '../models/turno';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class TurnoService extends GenericService<Turno> {

  private endpoint = this.api + 'turno/';

  constructor(
    public http: HttpClient
  ) {
    super(http, 'turno/');
  }

}
