/*  Importacion de Modulos especificos */
import { AngularMaterialModule } from './demo-material-module';
import { SharedModule } from './shared/shared.module';

/*  Importacion de Modulos particulares */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/*  Importacion de otros omponentes */
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { registerLocaleData } from '@angular/common';
import { LoginComponent } from './components/usuarios/login/login.component';

/*  Importacion del Spinner */
import { SpinnerComponent } from './shared/spinner.component';

/* localidazacion */
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es');



@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    AppHeaderComponent,
    SpinnerComponent,
    LoginComponent,
    AppSidebarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes)
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
