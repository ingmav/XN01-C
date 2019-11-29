/**
* <h1>Crud Service</h1>
*<p>
* El servicio crud se encarga de conectar las funciones que
* se encargan de listar, ver, modificar, agregar y eliminar
* con la api envia y obtiene valores para las vistas
* </p>
*
* @author  Eliecer Ramirez Esquinca
* @version 1.0
* @since   2017-05-08 
*/

import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { JwtRequestService } from '../jwt-request.service';

import { API_URL } from '../config';


@Injectable()
export class CrudService {

  /**
   * Este método inicializa la carga de las dependencias 
   * que se necesitan para el funcionamiento del modulo
   */
  constructor(private http: Http, private jwtRequest: JwtRequestService) { }

  /**
   * Este método obtiene una lista de elementos de la
   * api con los filtros que se especifiquen en la vista
   * @param term contiene las palabras de busqueda
   * @param pagina  inicio de la página para mostrar resultados
   * @param resultados_por_pagina  número de resultados por página
   * @param URL  ruta de la api donde se obtiene los valores
   * @return Respuesta tipo object que obtiene de la api
   */
  buscar(term: string, pagina: number = 1, resultados_por_pagina: number = 20, URL: string): Observable<any> {
    return this.jwtRequest.get(URL, null, { q: term, page: pagina, per_page: resultados_por_pagina }).map((response: Response) => response.json().data);
  }

  /**
   * Este método obtiene una lista de elementos de la
   * api con los filtros que se especifiquen en la vista
   * @param term contiene las palabras de busqueda
   * @param pagina  inicio de la página para mostrar resultados
   * @param resultados_por_pagina  número de resultados por página
   * @param URL  ruta de la api donde se obtiene los valores
   * @return Respuesta tipo object que obtiene de la api
   */

  busquedaInsumos(term: string, URL: string, parametros_adicionales: any = null): Observable<any> {

    var payload:any = {};
    if(!parametros_adicionales){
      payload = {
        term: term
      };
    } else {
      payload = parametros_adicionales;
      payload.term = term;
    }

    return this.jwtRequest.get(URL, null,
      payload).map(

  // busquedaInsumos(term: string, URL: string, programa?: string): Observable<any> {
  //   return this.jwtRequest.get(URL, null,
  //     {
  //       term: term,
  //       programa_id: programa
  //     }).map(

        (response: Response) => response.json().data
      );
  }

  /**
   * Este método obtiene una lista de elementos de la
   * api con los parametros que se especifiquen en la vista
   * @param pagina  inicio de la página para mostrar resultados
   * @param resultados_por_pagina  número de resultados por página
   * @param URL  ruta de la api donde se obtiene los valores
   * @return Respuesta tipo object que obtiene de la api
   */
  lista(pagina: number = 1, resultados_por_pagina: number = 20, URL: string): Observable<any> {
    if (pagina > 0)
      return this.jwtRequest.get(URL, null, { page: pagina, per_page: resultados_por_pagina }).map((response: Response) => response.json().data);
    else
      return this.jwtRequest.get(URL, null).map((response: Response) => response.json().data);
  }

  /**
   * Este método obtiene una lista de elementos de la
   * api con los parametros que se especifiquen en la vista
   * @param URL  ruta de la api donde se obtiene los valores
   * @return Respuesta tipo object que obtiene de la api
   */
  lista_general(URL: string): Observable<any> {
      return this.jwtRequest.get(URL, null).map((response: Response) => response.json().data);
  }

  lista_personalizada(payload:any ={},URL: string){
    console.log(payload);
    return this.jwtRequest.get(URL, null,payload).map((response: Response) => response.json().data);
  }

  /**
   * Este método obtiene el valor de un elementos de la
   * api con el id del elemento que se especifiquen en la vista
   * @param id  identificador del elemento
   * @param URL  ruta de la api donde se obtiene los valores
   * @return Respuesta tipo object que obtiene de la api
   */
  ver(id: any, URL: string): Observable<any> {
    return this.jwtRequest.get(URL, id, {}).map((response: Response) => {

      let jsonData = response.json().data;

      var data = jsonData as any;
      return data;
    }) as Observable<any>;
  }

  /**
   * Este método obtiene el valor de un elementos de la
   * api con el id del elemento que se especifiquen en la vista
   * @param URL  ruta de la api donde se obtiene los valores
   * @return Respuesta tipo object que obtiene de la api
   */
  verIniciar(URL: string): Observable<any> {
    return this.jwtRequest.get(URL).map((response: Response) => {

      let jsonData = response.json().data;

      let data = jsonData as any;
      return data;
    }) as Observable<any>;
  }


  /**
   * Este método envia el valor para crear un elementos en la
   * api con los datos que se especifiquen en la vista
   * @param data  datos del formulario a guardar
   * @param URL  ruta de la api donde se guardan los valores
   * @return Respuesta tipo object que obtiene de la api
   */
  crear(data: any[], URL: string): Observable<any> {
    return this.jwtRequest.post(URL, data).map((response: Response) => response.json().data) as Observable<any>;
  }


  /**
   * Este método actualiza la informacion de un elementos de la
   * api con el id y los datos del elemento que se especifiquen 
   * en la vista
   * @param id  identificador del elemento
   * @param data  datos del formulario a guardar
   * @param URL  ruta de la api donde se obtiene los valores
   * @return Respuesta tipo object que obtiene de la api
   */
  editar(id: any, data: any[], URL: string): Observable<any> {
    return this.jwtRequest.put(URL, id, data).map((response: Response) => response.json().data) as Observable<any>;
  }


  /**
   * Este método elimina el dato de un elementos de la
   * api con el id del elemento que se especifiquen en la vista
   * @param id  identificador del elemento
   * @param URL  ruta de la api donde se obtiene los valores
   * @return Respuesta tipo object que obtiene de la api
   */
  eliminar(id: any, URL: string): Observable<any> {
    return this.jwtRequest.delete(URL, id).map((response: Response) => response.json().data) as Observable<any>;
  }

}