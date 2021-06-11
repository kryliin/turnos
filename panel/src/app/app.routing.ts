import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './components/usuarios/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const AppRoutes: Routes = [

  { path: 'login', component: LoginComponent },

  {
    path: '',
    canActivate: [AuthGuard],
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/starter',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren:
          () => import('./components/material.module').then(m => m.MaterialComponentsModule)
      },
      {
        path: 'starter',
        loadChildren: () => import('./starter/starter.module').then(m => m.StarterModule)
      },
    ]
  }

];