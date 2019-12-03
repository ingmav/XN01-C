import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ChartModule } from 'angular2-highcharts';
//import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';


import { AuthGuard } from './auth-guard.service';
import { PermisosGuard } from './permisos.guard';
import { AuthService } from './auth.service';
import { JwtRequestService } from './jwt-request.service';
import { JwtHelper } from 'angular2-jwt';

import { AppRoutingModule }             from './app-routing.module';
import { WildcardRoutingModule } from './wildcard-routing.module';
import { HubModule } from './hub/hub.module';
import { PerfilModule } from './perfil/perfil.module';
import { BloquearPantallaModule } from './bloquear-pantalla/bloquear-pantalla.module';
import { PipesModule }             from './pipes/pipes.module';

// # Hub Panel de control
import { UsuariosModule } from './panel-control/usuarios/usuarios.module';
import { RolesModule    } from './panel-control/roles/roles.module';
import { PermisosModule     } from './panel-control/permisos/permisos.module';
import { SyncModule     } from './panel-control/sync/sync.module';
import { OpcionesAvanzadasModule  } from './panel-control/opciones-avanzadas/opciones-avanzadas.module';

import { ProduccionModule  } from './produccion/produccion.module';


export function highchartsFactory() {
  
  /*const hc = require('highcharts');
  const dd = require('highcharts/modules/exporting');
  dd(hc);
  return hc;*/
}

// Asegurarase que en imports "WildcardRoutingModule" vaya al ÚLTIMO
// Esto nos sirve para redireccionar a una página 404 en lugar de que se genere un error

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NotFoundComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartModule,
  
    AppRoutingModule,
    HubModule,
    PerfilModule,
    BloquearPantallaModule,
    PipesModule,

    SyncModule,
    OpcionesAvanzadasModule,
    RolesModule,
    PermisosModule,
    UsuariosModule,

    ProduccionModule,
        // Animations need to be imported in to your project to use the library
    BrowserAnimationsModule,
    WildcardRoutingModule, // Este siempre debe ir al final para que no haga conflicto con otras rutas

  ],
  providers: [
    Title,
    AuthGuard,
    PermisosGuard,
    AuthService,
    JwtHelper,
    JwtRequestService,
    // Uploader,
    /*{ provide: HighchartsStatic, useFactory: highchartsFactory},*/
    { provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
