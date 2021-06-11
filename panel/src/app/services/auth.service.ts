import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/old/usuario';
import { Role } from '../models/old/role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = environment.API_URL + 'auth/token';
  private _usuario: Usuario;
  private _token: string;

  constructor(private http: HttpClient) { }

  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  login(usuario: Usuario): Observable<any> {
    const credenciales = btoa('angularapp' + ':' + 'Tecso.2019');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });
    let params = new URLSearchParams();
    params.set('grant_type', 'pass');
    params.set('user', usuario.user);
    params.set('pass', usuario.pass);
    return this.http.post<any>(this.api, params.toString(), { headers: httpHeaders });
  }

  guardarUsuario(accessToken: string): void {
    console.log('accessToken' + accessToken);
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.nombre = payload.user;
    this._usuario.user = payload.user;
    this._usuario.roles = payload.roles;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);
    console.log("AuthService.isAuthenticated token: " + this.token);
    console.log("AuthService.isAuthenticated payload: " + JSON.stringify(payload));
    if (payload != null && payload.user && payload.user.length > 0) {
      return true;
    }
    return false;
  }

  hasRole(role: string): boolean {
    if (this.usuario.roles.toString().includes(role) || role.includes(this.usuario.roles.toString())) {
      return true;
    } else {
      return false;
    }
  }

  logout(): void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }

  public isRoleAdmin(): Boolean {
    if (this.isAuthenticated()) {
      const role = [Role.ROLE_ADMIN];
      if (this.hasRole(role[0])) {
        return true;
      }
    }
    return false;
  }

  public isRoleUser(): Boolean {
    if (this.isAuthenticated()) {
      const role = [Role.ROLE_USER];
      if (this.hasRole(role[0])) {
        return true;
      }
    }
    return false;
  }

}