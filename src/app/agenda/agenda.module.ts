import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuModule } from './menu/menu.module';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { AgendaService } from './agenda.service';

import { AgendaRoutingModule } from './agenda-routing.module';
import { ProgramacionComponent } from './programacion/programacion.component';

@NgModule({
  imports: [
    CommonModule,
    AgendaRoutingModule,
    ReactiveFormsModule,
    MenuModule,
    FormsModule
  ],
  declarations: [ProgramacionComponent],
  providers: [ AuthService, AgendaService ]
})
export class AgendaModule { }
