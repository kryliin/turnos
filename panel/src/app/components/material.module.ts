import 'hammerjs';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../demo-material-module';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { UsuarioService } from '../services/usuario.service';
import { MaterialRoutes } from './material.routing';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { DialogCambiarPasswordComponent } from './usuarios/cambiar-assword/cambiar-password.dialog';
import { TipoComponent } from './tipo/tipo.component';
import { EspacioComponent } from './espacio/espacio.component';
import { TurnoComponent } from './turno/turno.component';
import { SectorComponent } from './sector/sector.component';
import { ChackInComponent } from './checkin/checkin.component';
import { PersonaComponent } from './persona/persona.component';
import { DialogoEspacio } from './espacio/dialogoEntidad/espacio.dialogo';
import { DialogoSector } from './sector/dialogoEntidad/sector.dialogo';
import { DialogoTipo } from './tipo/dialogoEntidad/tipo.dialogo';
import { DialogoTurno } from './turno/dialogoEntidad/turno.dialogo';
import { ReservasComponent } from './reservas/reservas.component';
import { DialogUsuarioComponent } from './usuarios/dialogUpdate/usuario.dialog';
import { ParametrosComponent } from './parametros/parametros.component';
import { DialogParametroComponent } from './parametros/dialogUpdate/parametro.dialog';



// Agregar en providers para insertar validacion por token
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    AngularMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule
  ],
  providers: [
    UsuarioService,
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },],

  entryComponents: [
    DialogoEspacio,
    DialogoTurno,
    DialogoTipo,
    DialogoSector,
    DialogUsuarioComponent,
    DialogParametroComponent,
    DialogCambiarPasswordComponent
  ],
  declarations: [
    DialogoEspacio,
    DialogoTipo,
    DialogoTurno,
    DialogoSector,
    DialogUsuarioComponent,
    DialogParametroComponent,
    DialogCambiarPasswordComponent,
    UsuariosComponent,
    TipoComponent,
    EspacioComponent,
    TurnoComponent,
    SectorComponent,
    ChackInComponent,
    PersonaComponent,
    ReservasComponent,
    ParametrosComponent
  ]
})
export class MaterialComponentsModule { }
