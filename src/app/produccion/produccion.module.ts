import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuModule } from './menu/menu.module';
import { PaginacionModule } from '../paginacion/paginacion.module';
import { AuthService } from '../auth.service';
import { ProduccionService } from './produccion.service';
import { FormsModule } from '@angular/forms';

import { ProduccionRoutingModule } from './produccion-routing.module';
import { ListaComponent } from './lista/lista.component';
import { DisenoComponent } from './diseno/diseno.component';
import { TerminadoComponent } from './terminado/terminado.component';
import { MaquilasComponent } from './maquilas/maquilas.component';
import { TableroComponent } from './tablero/tablero.component';
import { ImpresionGfComponent } from './impresion-gf/impresion-gf.component';
import { ImpresionDigitalComponent } from './impresion-digital/impresion-digital.component';
import { PanelInicialComponent } from './panel-inicial/panel-inicial.component';

@NgModule({
  imports: [
    CommonModule,
    ProduccionRoutingModule,
    ReactiveFormsModule,
    PaginacionModule,
    MenuModule,
    FormsModule
  ],
  declarations: [ListaComponent, DisenoComponent, TerminadoComponent, MaquilasComponent, TableroComponent, ImpresionGfComponent, ImpresionDigitalComponent, PanelInicialComponent],
  providers: [ AuthService, ProduccionService ]
})
export class ProduccionModule { }
