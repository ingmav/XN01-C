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

const routes: Routes =  [
  {
    path: 'produccion',
    children: [
       { path: '', component: ListaComponent, canActivate: [PermisosGuard], data: { key: 'KaO6yvc7zbPGwlsViUtNZg94Bk9E0ThZ'} },   
       { path: 'lista', component: ListaComponent, canActivate: [PermisosGuard], data: { key: 'KaO6yvc7zbPGwlsViUtNZg94Bk9E0ThZ'} }, 
       { path: 'diseno', component: DisenoComponent, canActivate: [PermisosGuard], data: { key: 'KaO6yvc7zbPGwlsViUtNZg94Bk9E0ThZ'} }, 
       { path: 'impresion-gf', component: ImpresionGfComponent, canActivate: [PermisosGuard], data: { key: 'KaO6yvc7zbPGwlsViUtNZg94Bk9E0ThZ'} }, 
       { path: 'impresion-digital', component: ImpresionDigitalComponent, canActivate: [PermisosGuard], data: { key: 'KaO6yvc7zbPGwlsViUtNZg94Bk9E0ThZ'} }, 
       { path: 'terminados', component: TerminadoComponent, canActivate: [PermisosGuard], data: { key: 'KaO6yvc7zbPGwlsViUtNZg94Bk9E0ThZ'} }, 
       { path: 'maquilas', component: MaquilasComponent, canActivate: [PermisosGuard], data: { key: 'KaO6yvc7zbPGwlsViUtNZg94Bk9E0ThZ'} }, 
       { path: 'tablero', component: TableroComponent, canActivate: [PermisosGuard], data: { key: 'KaO6yvc7zbPGwlsViUtNZg94Bk9E0ThZ'} }, 
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProduccionRoutingModule { }
