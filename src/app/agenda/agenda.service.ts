import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { JwtRequestService } from '../jwt-request.service';
import { map } from 'rxjs/operators';

@Injectable()
export class AgendaService {

  constructor(private http: Http,   private jwtRequest:JwtRequestService) { }

  static readonly URL: string = "calendarizar";
  static readonly URL_CATALOGO: string = "catalogos";

  listar(): Observable<any>{
		return this.jwtRequest.get(AgendaService.URL,null,{}).map( (response: Response) => response.json().data);
  }

  guardar_actividad(obj: any):Observable<any> {
    return this.jwtRequest.put(AgendaService.URL,obj.id, obj).map( (response: Response) => response.json().data) as Observable<any>;
  }

  catalogos():Observable<any> {
    return this.jwtRequest.get(AgendaService.URL_CATALOGO,null,{}).map( (response: Response) => response.json().data) as Observable<any>;
  }

  eliminar_actividad(id: any): Observable<any> {
    return this.jwtRequest.delete(AgendaService.URL, id).map((response: Response) => response.json().data) as Observable<any>;
}

  
}