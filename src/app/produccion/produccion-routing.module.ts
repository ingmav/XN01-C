import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth-guard.service';
import { PermisosGuard } from '../permisos.guard';
import { ListaComponent } from './lista/lista.component';
import { DisenoComponent } from './diseno/diseno.component';
import { ImpresionComponent } from './impresion/impresion.component';
import { TerminadoComponent } from './terminado/terminado.component';
import { MaquilasComponent } from './maquilas/maquilas.component';
import { TableroComponent } from './tablero/tablero.component';

const routes: Routes =  [
  {
    path: 'produccion',
    children: [
       { path: '', component: ListaComponent, canActivate: [PermisosGuard], data: { key: 'BXn7v2ocepOf6bI9Ae5BwQlQqdGtpA7K'} },   
       { path: 'lista', component: ListaComponent, canActivate: [PermisosGuard], data: { key: 'BXn7v2ocepOf6bI9Ae5BwQlQqdGtpA7K'} }, 
       { path: 'diseno', component: DisenoComponent, canActivate: [PermisosGuard], data: { key: 'HC8qcdKns2j6CI0rox9s1EbzmsIDXhHH'} }, 
       { path: 'impresion', component: ImpresionComponent, canActivate: [PermisosGuard], data: { key: 'HC8qcdKns2j6CI0rox9s1EbzmsIDXhHH'} }, 
       { path: 'terminados', component: TerminadoComponent, canActivate: [PermisosGuard], data: { key: 'HC8qcdKns2j6CI0rox9s1EbzmsIDXhHH'} }, 
       { path: 'maquilas', component: MaquilasComponent, canActivate: [PermisosGuard], data: { key: 'HC8qcdKns2j6CI0rox9s1EbzmsIDXhHH'} }, 
       { path: 'tablero', component: TableroComponent, canActivate: [PermisosGuard], data: { key: 'HC8qcdKns2j6CI0rox9s1EbzmsIDXhHH'} }, 
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProduccionRoutingModule { }
