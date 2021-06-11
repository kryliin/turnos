import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Localidad } from '../models/localidad';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class LocalidadService extends GenericService<Localidad> {

  private endpoint = this.api + 'localidades/';

  constructor(
    public http: HttpClient
  ) {
    super(http, 'localidades/');
  }

}

