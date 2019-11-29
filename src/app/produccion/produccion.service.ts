import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { JwtRequestService } from '../jwt-request.service';

@Injectable()
export class ProduccionService {

  constructor(private http: Http,   private jwtRequest:JwtRequestService) { }

  static readonly URL: string = "trabajos-pendientes";

  listar(pagina:number = 1, resultados_por_pagina:number =20 ): Observable<any>{
		return this.jwtRequest.get(ProduccionService.URL,null,{page: pagina, per_page: resultados_por_pagina}).map( (response: Response) => response.json().data);
  }

}
