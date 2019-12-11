import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth-guard.service';
import { PermisosGuard } from '../permisos.guard';
import { ListaComponent } from './lista/lista.component';
import { DisenoComponent } from './diseno/diseno.component';
import { ImpresionGfComponent } from './impresion-gf/impresion-gf.component';
import { ImpresionDigitalComponent } from './impresion-digital/impresion-digital.component';
import { TerminadoComponent } from './terminado/terminado.component';
import { MaquilasComponent } from './maquilas/maquilas.component';
import { TableroComponent } from './tablero/tablero.component';
import { PanelInicialComponent } from './panel-inicial/panel-inicial.component';

const routes: Routes =  [
  {
    path: 'produccion',
    children: [
       { path: '', component: PanelInicialComponent, canActivate: [PermisosGuard], data: { key: 'thbUQ8aaGRZL8kOVDRKMR45hDbxvJWsE'} },   
       { path: 'lista', component: ListaComponent, canActivate: [PermisosGuard], data: { key: 'nzHzp0gz4wOA6q7oJmllQGRfencZw92d'} }, 
       { path: 'diseno', component: DisenoComponent, canActivate: [PermisosGuard], data: { key: 'VVUmMn5z5OZ2U2gE9h8osymi93HEjxpK'} }, 
       { path: 'impresion-gf', component: ImpresionGfComponent, canActivate: [PermisosGuard], data: { key: 'MmKDlGTTmfCWOCVIoSlNX4qN96EFDMBA'} }, 
       { path: 'impresion-digital', component: ImpresionDigitalComponent, canActivate: [PermisosGuard], data: { key: 'IoBPFfYRYXr0oTkiFLjZS7wdlmh75ySJ'} }, 
       { path: 'terminados', component: TerminadoComponent, canActivate: [PermisosGuard], data: { key: 'DezCUjFR54fvGMScTrVO77ceBVSzB2Nf'} }, 
       { path: 'maquilas', component: MaquilasComponent, canActivate: [PermisosGuard], data: { key: 'RYUiHOsJ78t172DRmsfcasKXc3rIyKMw'} }, 
       { path: 'tablero', component: TableroComponent, canActivate: [PermisosGuard], data: { key: 'PzVYnzkMdBHzBpK63thGwPoMqQFCHIkl'} }, 
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProduccionRoutingModule { }
