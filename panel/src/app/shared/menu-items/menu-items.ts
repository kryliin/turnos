import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  { state: 'checkin', name: 'Check In', type: 'link', icon: 'ballot' },
  { state: 'reservas', name: 'Reservas', type: 'link', icon: 'ballot' },
  { state: 'espacios', name: 'Espacios', type: 'link', icon: 'ballot' },
  { state: 'sectores', name: 'Sectores', type: 'link', icon: 'ballot' },
  { state: 'tipos', name: 'Tipos', type: 'link', icon: 'ballot' },
  { state: 'turnos', name: 'Turnos', type: 'link', icon: 'ballot' },
  { state: 'parametros', name: 'Parametros', type: 'link', icon: 'ballot' },
  { state: 'usuarios', name: 'Usuarios', type: 'link', icon: 'ballot' }
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
