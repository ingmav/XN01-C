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
  selector: 'app-diseno',
  templateUrl: './diseno.component.html',
  styleUrls: ['./diseno.component.css']
})
export class DisenoComponent implements OnInit {

  cargando: boolean = false;

  showProduccion:boolean = false;

  obj_produccion:any = { 'cliente': {}};

  produccion:any = { 'ventas_id':0, 'diseno':false, 'impresion': false, 'preparacion':false, 'instalacion':false, 'entrega':false, 'maquilas':false }; 
  produccion_reset:any = { 'ventas_id':0, 'diseno':false, 'impresion': false, 'preparacion':false, 'instalacion':false, 'entrega':false, 'maquilas':false }; 
  
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
    this.title.setTitle("PRODUCCIÓN DISEÑO");
    this.mensajeError = new Mensaje();
    this.mensajeExito = new Mensaje();

    this.listar(1);

    var self = this;

    var busquedaSubject = this.terminosBusqueda
	    .debounceTime(300) // Esperamos 300 ms pausando eventos
	    .distinctUntilChanged() // Ignorar si la busqueda es la misma que la ultima
	    .switchMap((term:string)  =>  { 
	      
        this.busquedaActivada = term != "" ? true: false;

        this.ultimoTerminoBuscado = term;
        this.paginaActualBusqueda = 1;
        this.cargando = true;
	      return term  ? this.produccionService.buscar_detalle_produccion(term, this.paginaActualBusqueda, this.resultadosPorPaginaBusqueda, 1) : Observable.of<any>({data:[]}) 
	    }
	      
	    
	    ).catch( function handleError(error){ 
	     
	      self.cargando = false;      
	      self.mensajeError.mostrar = true;
	      self.ultimaPeticion = function(){self.listarBusquedaProduccion(self.ultimoTerminoBuscado,self.paginaActualBusqueda);};//OJO
	      try {
	        let e = error.json();
	        if (error.status == 401 ){
	          self.mensajeError.texto = "No tiene permiso para hacer esta operación.";
	        }
	      } catch(e){
	        console.log("No se puede interpretar el error");
	        
	        if (error.status == 500 ){
	          self.mensajeError.texto = "500 (Error interno del servidor)";
	        } else {
	          self.mensajeError.texto = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.";
	        }            
	      }
	      // Devolvemos el subject porque si no se detiene el funcionamiento del stream 
	      return busquedaSubject
	    
	    });

	    busquedaSubject.subscribe(
	      resultado => {
	        this.cargando = false;
	        this.resultadosBusqueda = resultado.data as any[];
	        this.totalBusqueda = resultado.total | 0;
	        this.paginasTotalesBusqueda = Math.ceil(this.totalBusqueda / this.resultadosPorPaginaBusqueda);

	        this.indicePaginasBusqueda = [];
	        for(let i=0; i< this.paginasTotalesBusqueda; i++){
	          this.indicePaginasBusqueda.push(i+1);
	        }
	        
	        console.log("Búsqueda cargada.");
	      }

	    );
  }

  listar(paginate:number):void{
    this.paginaActual = paginate;
    
    this.cargando = true;
    this.produccionService.listarProduccion(paginate,this.resultadosPorPagina, 1).subscribe(
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

  agregar_agenda(obj:any, tipo_produccion:number)
  {
    let obj_calendario = { id: obj.id, etapa_produccion: tipo_produccion };
    this.produccionService.caledario_produccion(obj_calendario).subscribe(
      resultado => {


        this.listar(1);
        this.mensajeExito.mostrar = true;
        this.mensajeExito.texto = "Se ha gaurdado Exitosamente el trabajo";
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

  iniciar_trabajo(obj:any, tipo_produccion:number)
  {
    let obj_inicial = { id: obj.id, etapa_produccion: tipo_produccion };
    this.produccionService.obj_inicial(obj_inicial).subscribe(
      resultado => {
        this.listar(1);
        this.mensajeExito.mostrar = true;
        this.mensajeExito.texto = "Se ha gaurdado Exitosamente el trabajo";
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

  finalizar(obj:any, tipo_produccion:number)
  {
    if(confirm("¿REALMENTE DESEA FINALIZAR ESTA ACTIVIDAD?"))
    {
      let obj_finalizar = { id: obj.id, etapa_produccion: tipo_produccion };
      this.produccionService.finalizar(obj_finalizar).subscribe(
        resultado => {
          this.listar(1);
          this.mensajeExito.mostrar = true;
          this.mensajeExito.texto = "Se ha gaurdado Exitosamente el trabajo";
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

  listarBusquedaProduccion(term:string ,pagina:number): void {
    this.paginaActualBusqueda = pagina;

    this.cargando = true;
    this.produccionService.buscar_detalle_produccion(term, pagina, this.resultadosPorPaginaBusqueda, 1).subscribe(
        resultado => {
          this.cargando = false;

          this.resultadosBusqueda = resultado.data as any[];

          this.totalBusqueda = resultado.total | 0;
          this.paginasTotalesBusqueda = Math.ceil(this.totalBusqueda / this.resultadosPorPaginaBusqueda);

          this.indicePaginasBusqueda = [];
          for(let i=0; i< this.paginasTotalesBusqueda; i++){
            this.indicePaginasBusqueda.push(i+1);
          }
          
        },
        error => {
          this.cargando = false;
          this.mensajeError.mostrar = true;
          this.ultimaPeticion = function(){this.listarBusqueda(term,pagina);};
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

  buscar(term: string): void {
		this.terminosBusqueda.next(term);
  }
  
  paginaSiguiente():void {
    this.listar(this.paginaActual+1);
  }
  paginaAnterior():void {
      this.listar(this.paginaActual-1);
  }

  paginaSiguienteBusqueda(term:string):void {
      this.listarBusquedaProduccion(term,this.paginaActualBusqueda+1);
  }
  paginaAnteriorBusqueda(term:string):void {
      this.listarBusquedaProduccion(term,this.paginaActualBusqueda-1);
  }
 
}
