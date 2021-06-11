import { Routes } from '@angular/router';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { EspacioComponent } from './espacio/espacio.component';
import { SectorComponent } from './sector/sector.component';
import { TipoComponent } from './tipo/tipo.component';
import { TurnoComponent } from './turno/turno.component';
import { PersonaComponent } from './persona/persona.component';
import { ChackInComponent } from './checkin/checkin.component';
import { ReservasComponent } from './reservas/reservas.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { RoleGuard } from '../guards/role.guard';
import { Role } from '../models/old/role';

export const MaterialRoutes: Routes = [
  /*
    {
      path: 'ctacte',
      component: CtacteComponent,
      data: {
        authorities: [Role.ROLE_SUPER, Role.ROLE_ADMIN, Role.ROLE_USER],
      },
      canActivate: [RoleGuard]
    },
    */
  {
    path: 'espacios',
    component: EspacioComponent,
    data: {
      authorities: [Role.ROLE_ADMIN],
    },
    canActivate: [RoleGuard]
  },

  {
    path: 'sectores',
    component: SectorComponent,
    data: {
      authorities: [Role.ROLE_ADMIN],
    },
    canActivate: [RoleGuard]
  },

  {
    path: 'tipos',
    component: TipoComponent,
    data: {
      authorities: [Role.ROLE_ADMIN],
    },
    canActivate: [RoleGuard]
  },

  {
    path: 'turnos',
    component: TurnoComponent,
    data: {
      authorities: [Role.ROLE_ADMIN],
    },
    canActivate: [RoleGuard]
  },

  {
    path: 'checkin',
    component: ChackInComponent,
    data: {
      authorities: [Role.ROLE_ADMIN, Role.ROLE_USER],
    },
    canActivate: [RoleGuard]
  },

  {
    path: 'reservas',
    component: ReservasComponent,
    data: {
      authorities: [Role.ROLE_ADMIN, Role.ROLE_USER],
    },
    canActivate: [RoleGuard]
  },

  {
    path: 'personas',
    component: PersonaComponent,
    data: {
      authorities: [Role.ROLE_ADMIN],
    },
    canActivate: [RoleGuard]
  },

  {
    path: 'parametros',
    component: ParametrosComponent,
    data: {
      authorities: [Role.ROLE_ADMIN],
    },
    canActivate: [RoleGuard]
  },

  {
    path: 'usuarios',
    component: UsuariosComponent,
    data: {
      authorities: [Role.ROLE_ADMIN],
    },
    canActivate: [RoleGuard]
  }

];
