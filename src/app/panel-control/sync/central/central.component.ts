import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';


import { Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';

import  * as FileSaver    from 'file-saver'; 

import { environment } from '../../../../environments/environment';

import { SyncService } from '../sync.service';

import { Mensaje } from '../../../mensaje';


@Component({
  selector: 'app-central',
  templateUrl: './central.component.html',
  styleUrls: ['./central.component.css'],
  providers: [SyncService]
})
export class CentralComponent implements OnInit {

  // # SECCION: Esta sección es para mostrar mensajes
	mensajeError: Mensaje = new Mensaje();
	mensajeExito: Mensaje = new Mensaje();
	ultimaPeticion:any;
	
	documentoSubido:boolean = false;
	// # FIN SECCION

	// # SECCION: Lista 
	lista: any[] = [];
	paginaActual = 1;
	resultadosPorPagina = 10;
	total = 0;
	paginasTotales = 0;
	indicePaginas:number[] = []
	// # FIN SECCION

	// # SECCION: Resultados de búsqueda
	ultimoTerminoBuscado = "";
	terminosBusqueda = new Subject<string>();
	resultadosBusqueda: any[] = [];
	busquedaActivada:boolean = false;
	paginaActualBusqueda = 1;
	resultadosPorPaginaBusqueda = 10;
	totalBusqueda = 0;
	paginasTotalesBusqueda = 0;
	indicePaginasBusqueda:number[] = []
	// # FIN SECCION

	errores = {
		archivo: null
	}

	mostrarModalSubirArchivoSync:boolean = false;
	mensajeErrorSync:string = "";
	archivo:File = null;
	archivoSubido:boolean = false;
  	enviandoDatos: boolean = false;
  	progreso: number = 0;

	constructor(private apiService: SyncService, private http:Http) { }
	cargando: boolean = false;
	

	ngOnInit() {
		this.listar(1);
		this.mensajeError = new Mensaje();
		this.mensajeExito = new Mensaje();

		var self = this;

		var busquedaSubject = this.terminosBusqueda
		.debounceTime(300) // Esperamos 300 ms pausando eventos
		.distinctUntilChanged() // Ignorar si la busqueda es la misma que la ultima
		.switchMap((term:string)  =>  { 
		console.log("Cargando búsqueda.");
		this.busquedaActivada = term != "" ? true: false;

		this.ultimoTerminoBuscado = term;
		this.paginaActualBusqueda = 1;
		this.cargando = true;
		return term  ? this.apiService.buscar(term, this.paginaActualBusqueda, this.resultadosPorPaginaBusqueda) : Observable.of<any>({data:[]}) 
		}
		
		
		).catch( function handleError(error){ 
		
		self.cargando = false;      
		self.mensajeError.mostrar = true;
		self.ultimaPeticion = function(){self.listarBusqueda(self.ultimoTerminoBuscado,self.paginaActualBusqueda);};//OJO
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

	buscar(term: string): void {
		this.terminosBusqueda.next(term);
	}

	listarBusqueda(term:string ,pagina:number): void {
		this.paginaActualBusqueda = pagina;
		console.log("Cargando búsqueda.");
	
		this.cargando = true;
		this.apiService.buscar(term, pagina, this.resultadosPorPaginaBusqueda).subscribe(
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


  	listar(pagina:number): void {
		this.paginaActual = pagina;
		console.log("Cargando items.");
	
		this.cargando = true;
		this.apiService.listaPaginada(pagina,this.resultadosPorPagina).subscribe(
			resultado => {
			this.cargando = false;
			this.lista = resultado.data as any[];

			this.total = resultado.total | 0;
			this.paginasTotales = Math.ceil(this.total / this.resultadosPorPagina);

			this.indicePaginas = [];
			for(let i=0; i< this.paginasTotales; i++){
				this.indicePaginas.push(i+1);
			}

			console.log("Items cargados.");
			
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

	// # SECCION: Paginación
	paginaSiguiente():void {
		this.listar(this.paginaActual+1);
	}
	paginaAnterior():void {
		this.listar(this.paginaActual-1);
	}

	paginaSiguienteBusqueda(term:string):void {
		this.listarBusqueda(term,this.paginaActualBusqueda+1);
	}
	paginaAnteriorBusqueda(term:string):void {
		this.listarBusqueda(term,this.paginaActualBusqueda-1);
	}

	// # SECCION: Sincronización

	fileChange(event){
		let fileList: FileList = event.target.files;
		if(fileList.length > 0) {
			this.archivo = fileList[0];
		}
	}

	reset(){
		this.errores = {
			archivo: null
		}
		
		this.mensajeErrorSync = "";
		this.archivoSubido = false;
		this.archivo = null;
	}
	
	// En este caso la respuesta no será un json, sino un archivo,
	// la librería que uso en otros módulos de sincronizacion no me permite descargar
	// archivos porque no me permite setear de manera correcta los headers
	// Por este motivo se implementa la petición usando las funciones que nos provee angular2
	adjuntar(){
		if(this.archivo){

			this.errores = {
			archivo: null
			}
			this.mensajeErrorSync = "";
			this.archivoSubido = false;
			this.enviandoDatos = true;
			
			let formData:FormData = new FormData();
			formData.append('sync', this.archivo, this.archivo.name);
			
			let headers = new Headers();
			headers.delete('Content-Type');
			headers.append('Authorization',  'Bearer ' + localStorage.getItem('token'));
			let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
			//let options = new RequestOptions({ headers: headers });

			
			var responseHeaders:any;
			var contentDisposition:any;
			this.http.post(`${environment.API_URL}/sync/importar`, formData, options)
				.map(response => {					
					contentDisposition = response.headers.get('content-disposition');
					return response.blob()
				})
				.catch(error => Observable.throw(error))				
				.subscribe(
					blob => {
						var filename;
						var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
						var matches = filenameRegex.exec(contentDisposition);
						if (matches != null && matches[1]) { 
							filename = matches[1].replace(/['"]/g, '');
						}
						FileSaver.saveAs(blob, filename);
						this.archivoSubido = true;
						this.enviandoDatos = false;
						this.progreso = 100;
					},					
					error => {
						console.log(error);
						if(error.status == 409){
							this.mensajeErrorSync = "No se pudo subir el archivo, verifica que el archivo que tratas de subir sea correcto, que el nombre no haya sido modificado. Verifica que el archivo que intentas subir ya ha sido sincronizado previamente.";
						} else if(error.status == 401){
							this.mensajeErrorSync = "El archivo que intentas subir ya ha sido sincronizado previamente";
						} else {
							this.mensajeErrorSync = "Hubo un problema al sincronizar, prueba recargar el sitio de lo contrario llama a soporte técnico.";
						}
						
						this.progreso = 100;
						this.enviandoDatos = false;
					}
					
				)
			
			
			
		}
	
	}
	
	
}
