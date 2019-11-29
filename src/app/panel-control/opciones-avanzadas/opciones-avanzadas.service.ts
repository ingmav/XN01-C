import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { JwtRequestService } from '../../jwt-request.service';


@Injectable()
export class OpcionesAvanzadasService {

  static readonly URL: string = "opciones-avanzadas";
  
  constructor(private http: Http,   private jwtRequest:JwtRequestService) { }
  

  actualizarViaGit(): Observable<any>{
    return this.jwtRequest.get(OpcionesAvanzadasService.URL+"/actualizar-plataforma-git",null,{}).map( (response: Response) => response.json().data ) as Observable<any>;
  }

  exportarBaseDatos(): Observable<any>{
    return this.jwtRequest.get(OpcionesAvanzadasService.URL+"/exportar-base-datos",null,{}).map( (response: Response) => response.json().data ) as Observable<any>;
  }

  
}
