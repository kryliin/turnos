import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tipo } from '../models/tipo';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class TipoService extends GenericService<Tipo> {

  private endpoint = this.api + 'tipo/';

  constructor(
    public http: HttpClient
  ) {
    super(http, 'tipo/');
  }

}
