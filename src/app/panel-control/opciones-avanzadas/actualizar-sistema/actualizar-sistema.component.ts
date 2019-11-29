import { Component, OnInit } from '@angular/core';

import { OpcionesAvanzadasService } from '../opciones-avanzadas.service';

@Component({
  selector: 'app-actualizar-sistema',
  templateUrl: './actualizar-sistema.component.html',
  styleUrls: ['./actualizar-sistema.component.css']
})
export class ActualizarSistemaComponent implements OnInit {
  cargando: boolean = false;
  mostrarLog:boolean = false;
  logActualizacion:string = "";
  constructor(private apiService:OpcionesAvanzadasService) { }

  ngOnInit() {
  }

  actualizarViaGit() {
    this.apiService.actualizarViaGit().subscribe(
			respuesta => {
				this.cargando = false;				
				this.logActualizacion = respuesta;
				this.mostrarLog = true;
				
			
			},
			error => {
				this.cargando = false;				
				console.log(error);

			}
		);

  }

}
