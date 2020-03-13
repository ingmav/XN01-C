import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth-guard.service';
import { PermisosGuard } from '../permisos.guard';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
//import { MenuModule } from './menu/menu.module';
import { PaginacionModule } from '../paginacion/paginacion.module';
import { AuthService } from '../auth.service';

import { ListaComponent } from './lista/lista.component';
import { NuevoComponent } from './nuevo/nuevo.component';

const routes: Routes = [
  {
  path: 'callcenter',
  children: [
     { path: '', component: ListaComponent, canActivate: [PermisosGuard], data: { key: 'thbUQ8aaGRZL8kOVDRKMR45hDbxvJWsE'} },   
     { path: 'lista', component: ListaComponent, canActivate: [PermisosGuard], data: { key: 'nzHzp0gz4wOA6q7oJmllQGRfencZw92d'} },
     { path: 'nuevo', component: NuevoComponent, canActivate: [PermisosGuard], data: { key: 'nzHzp0gz4wOA6q7oJmllQGRfencZw92d'} }
  ],
  canActivate: [AuthGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallcenterRoutingModule { }
