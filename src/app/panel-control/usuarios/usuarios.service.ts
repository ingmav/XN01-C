import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { JwtRequestService } from '../../jwt-request.service';

//import { API_URL } from '../../config';

import { Usuario } from './usuario';
import { Rol } from '../roles/rol';


@Injectable()
export class UsuariosService {

  static readonly URL: string = "usuarios";
  
  constructor(private http: Http,   private jwtRequest:JwtRequestService) { }

  buscar(term: string, pagina:number = 1, resultados_por_pagina:number =20 ): Observable<any>{
    return this.jwtRequest.get(UsuariosService.URL,null,{q: term, page: pagina, per_page: resultados_por_pagina}).map( (response: Response) => response.json().data);
  }

  lista(pagina:number = 1, resultados_por_pagina:number =20 ): Observable<any>{
    return this.jwtRequest.get(UsuariosService.URL,null,{page: pagina, per_page: resultados_por_pagina}).map( (response: Response) => response.json().data);
  }

  ver(id:any): Observable<Usuario>{
    return this.jwtRequest.get(UsuariosService.URL,id,{}).map( (response: Response) => {
     
      
       let jsonData = response.json().data;
       console.log(response.json().data);
        var roles:string[] = []
        jsonData.roles.map(item => {
          roles.push(""+item.id)
        })

        
        
        var temas_agregados:string[] = []
        jsonData.usuario_tema.map(item => {
          temas_agregados.push(item)
        })

        

        var usuario = jsonData as Usuario;
        usuario.roles = roles;

        usuario.usuario_tema = temas_agregados;

        return usuario;
      }) as Observable<Usuario>;
  }

  crear(usuario: Usuario): Observable<Usuario> {
    return this.jwtRequest.post(UsuariosService.URL,usuario).map( (response: Response) => response.json().data) as Observable<Usuario>;
  }

  editar(id:any, usuario: Usuario): Observable<Usuario> {
    return this.jwtRequest.put(UsuariosService.URL,id, usuario).map( (response: Response) => response.json().data) as Observable<Usuario>;
  }

  eliminar(id:any): Observable<Usuario> {
    return this.jwtRequest.delete(UsuariosService.URL,id).map( (response: Response) => response.json().data) as Observable<Usuario>;
  }

  listaUnidadesMedicas( ): Observable<any>{
    return this.jwtRequest.get("unidades-medicas",null,null).map( (response: Response) => response.json().data);
  }

  listaMedicos( ): Observable<any>{

    var usuario = JSON.parse(localStorage.getItem("usuario"));
    return this.jwtRequest.get("personal-clues",null,{clues: usuario.clues_activa.clues}).map( (response: Response) => response.json().data);
  }

  carga_catalogos(): Observable<any>{
		return this.jwtRequest.get('catalogos-programacion',null,{}).map( (response: Response) => response.json().data);
  }

}
