import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, FormControl, NgModel  } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

import { Mensaje } from '../../mensaje';
import { ProduccionService } from '../produccion.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  cargando: boolean = false;
  showDialog:boolean = false;
  
  // # SECCION: Esta sección es para mostrar mensajes
  mensajeError: Mensaje = new Mensaje();
  mensajeExito: Mensaje = new Mensaje();
  
  ultimaPeticion:any;
  form_principal: FormGroup;
  // # FIN SECCION

  // # SECCION: Lista de porgramacion
  busqueda: any = {buscarText:'', id_jurisdiccion: '0', id_tipo:'0'};
  lista: any[] = [];
  paginaActual = 1;
  resultadosPorPagina = 25;
  total = 0;
  paginasTotales = 0;
  indicePaginas:number[] = [];
  // # FIN SECCION

  // # SECCION: Resultados de búsqueda
  ultimoTerminoBuscado = "";
  terminosBusqueda = new Subject<string>();
  resultadosBusqueda: any[] = [];
  busquedaActivada:boolean = false;
  paginaActualBusqueda = 1;
  resultadosPorPaginaBusqueda = 25;
  totalBusqueda = 0;
  paginasTotalesBusqueda = 0;
  indicePaginasBusqueda:number[] = [];

  constructor(
    private title: Title,
    private produccionService:ProduccionService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.title.setTitle("Trabajos en Espera");
    this.mensajeError = new Mensaje();
    this.mensajeExito = new Mensaje();

    this.listar(1);
  }

  listar(paginate:number):void{
    this.paginaActual = paginate;
    
    this.cargando = true;
    this.produccionService.listar(paginate,this.resultadosPorPagina).subscribe(
      resultado => {
        
        this.cargando = false;
        this.lista = resultado.data as any[];
        this.total = resultado.total | 0;
        this.paginasTotales = Math.ceil(this.total / this.resultadosPorPagina);

        this.indicePaginas = [];
        for(let i=0; i< this.paginasTotales; i++){
          this.indicePaginas.push(i+1);
        }
        
      },
      error => {
        this.cargando = false;
        this.mensajeError.mostrar = true;
        this.ultimaPeticion = this.listar;
        try {
          let e = error.json();
          if (error.status == 401 ){
            this.mensajeError.texto = "No tiene permiso para hacer esta operación.";
          }
        } catch(e){
          console.log("No se puede interpretar el error");
          
          if (error.status == 500 ){
            this.mensajeError.texto = "500 (Error interno del servidor)";
          } else {
            this.mensajeError.texto = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.";
          }            
        }

      }
    );
  }
}
