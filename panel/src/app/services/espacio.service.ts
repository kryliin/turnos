import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Espacio } from '../models/espacio';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class EspacioService extends GenericService<Espacio> {

  private endpoint = this.api + 'espacio/';

  constructor(
    public http: HttpClient
  ) {
    super(http, 'espacio/');
  }

}
