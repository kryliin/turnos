import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/old/usuario';
import { GenericService } from './generic.service';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends GenericService<Usuario> {

  private endpoint = this.api + 'usuario/';

  constructor(
    public http: HttpClient
  ) {
    super(http, 'usuario/');
  }

}