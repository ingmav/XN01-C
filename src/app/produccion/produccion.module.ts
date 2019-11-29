import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuModule } from './menu/menu.module';
import { PaginacionModule } from '../paginacion/paginacion.module';
import { AuthService } from '../auth.service';
import { ProduccionService } from './produccion.service';

import { ProduccionRoutingModule } from './produccion-routing.module';
import { ListaComponent } from './lista/lista.component';
import { DisenoComponent } from './diseno/diseno.component';
import { ImpresionComponent } from './impresion/impresion.component';
import { TerminadoComponent } from './terminado/terminado.component';
import { MaquilasComponent } from './maquilas/maquilas.component';
import { TableroComponent } from './tablero/tablero.component';

@NgModule({
  imports: [
    CommonModule,
    ProduccionRoutingModule,
    ReactiveFormsModule,
    PaginacionModule,
    MenuModule
  ],
  declarations: [ListaComponent, DisenoComponent, ImpresionComponent, TerminadoComponent, MaquilasComponent, TableroComponent],
  providers: [ AuthService, ProduccionService ]
})
export class ProduccionModule { }
