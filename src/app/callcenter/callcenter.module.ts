import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

import { CallcenterRoutingModule } from './callcenter-routing.module';
import { ListaComponent } from './lista/lista.component';
import { NuevoComponent } from './nuevo/nuevo.component';

import { CallcenterService } from './callcenter.service';

@NgModule({
  imports: [
    CommonModule,
    CallcenterRoutingModule,
    FormsModule
  ],
  declarations: [ListaComponent, NuevoComponent],
  providers: [ AuthService, CallcenterService ]
})
export class CallcenterModule { }
