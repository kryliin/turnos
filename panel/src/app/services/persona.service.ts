import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Persona } from '../models/persona';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class PersonaService extends GenericService<Persona> {

  private endpoint = this.api + 'persona/';

  constructor(
    public http: HttpClient
  ) {
    super(http, 'persona/');
  }

}
