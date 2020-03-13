import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth-guard.service';
import { PermisosGuard } from '../permisos.guard';
import { ProgramacionComponent } from './programacion/programacion.component';


const routes: Routes = [
  {
    path: 'agenda',
    children: [
       { path: '', component: ProgramacionComponent, canActivate: [PermisosGuard], data: { key: 'thbUQ8aaGRZL8kOVDRKMR45hDbxvJWsE'} }
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaRoutingModule { }
