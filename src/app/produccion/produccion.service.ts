import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { JwtRequestService } from '../jwt-request.service';

@Injectable()
export class ProduccionService {

  constructor(private http: Http,   private jwtRequest:JwtRequestService) { }

  static readonly URL: string = "trabajos-pendientes";
  static readonly URL_PRODUCCION: string = "produccion";
  static readonly URL_AGENDA: string = "agenda";
  static readonly URL_INICIAL: string = "iniciar_trabajo";
  static readonly URL_FINALIZAR: string = "finalizar_trabajo";
  static readonly URL_TABLERO: string = "tablero";

  listar(pagina:number = 1, resultados_por_pagina:number =20 ): Observable<any>{
		return this.jwtRequest.get(ProduccionService.URL,null,{page: pagina, per_page: resultados_por_pagina}).map( (response: Response) => response.json().data);
  }

  buscar_detalle(term: string, pagina:number = 1, resultados_por_pagina:number =20 ): Observable<any>{
    return this.jwtRequest.get(ProduccionService.URL,null,{q: term, page: pagina, per_page: resultados_por_pagina}).map( (response: Response) => response.json().data);
  }

  buscar_detalle_produccion(term: string, pagina:number = 1, resultados_por_pagina:number =20, tipo_produccion:number ): Observable<any>{
    return this.jwtRequest.get(ProduccionService.URL,null,{q: term, page: pagina, per_page: resultados_por_pagina, etapa_produccion:tipo_produccion }).map( (response: Response) => response.json().data);
  }
  
  listarProduccion(pagina:number = 1, resultados_por_pagina:number =20, tipo_produccion:number ): Observable<any>{
		return this.jwtRequest.get(ProduccionService.URL_PRODUCCION,null,{page: pagina, per_page: resultados_por_pagina, etapa_produccion:tipo_produccion}).map( (response: Response) => response.json().data);
  }
  
  actualiza_estatus(tipo_produccion:number, estatus_produccion:number, id:number): Observable<any>{
		return this.jwtRequest.put(ProduccionService.URL_TABLERO, id,{tipo: tipo_produccion, estatus: estatus_produccion}).map( (response: Response) => response.json().data);
  }

  guardar_produccion(lista: any): Observable<any> {
    return this.jwtRequest.post(ProduccionService.URL, lista).map( (response: Response) => response.json().data) as Observable<any>;
  }

  caledario_produccion(obj: any):Observable<any> {
    return this.jwtRequest.put(ProduccionService.URL_AGENDA,obj.id, obj).map( (response: Response) => response.json().data) as Observable<any>;
  }
  
  obj_inicial(obj: any):Observable<any> {
    return this.jwtRequest.put(ProduccionService.URL_INICIAL,obj.id, obj).map( (response: Response) => response.json().data) as Observable<any>;
  }

  finalizar(obj: any):Observable<any> {
    return this.jwtRequest.put(ProduccionService.URL_FINALIZAR,obj.id, obj).map( (response: Response) => response.json().data) as Observable<any>;
  }

  //Tablero

  listarTablero(pagina:number = 1, resultados_por_pagina:number =20 ): Observable<any>{
		return this.jwtRequest.get(ProduccionService.URL_TABLERO,null,{page: pagina, per_page: resultados_por_pagina}).map( (response: Response) => response.json().data);
  }

  buscar_detalle_tablero(term: string, pagina:number = 1, resultados_por_pagina:number =20 ): Observable<any>{
    return this.jwtRequest.get(ProduccionService.URL_TABLERO,null,{q: term, page: pagina, per_page: resultados_por_pagina}).map( (response: Response) => response.json().data);
  }

  //

  syncronizar():Observable<any>{
    //return this.http.get("http://192.168.1.129/produccion_nexprint/sincronizacion/sincronizacion.php",{  })
    return this.http.get("http://localhost/proyectos_nexprint/msweb/sincronizacion/sincronizacion.php",{  })
    
    .map( (response: Response) => response.json().data);
  }
}
