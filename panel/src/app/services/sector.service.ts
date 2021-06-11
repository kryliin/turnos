import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sector } from '../models/sector';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SectorService extends GenericService<Sector> {

  private endpoint = this.api + 'sector/';

  constructor(
    public http: HttpClient
  ) {
    super(http, 'sector/');
  }

}
