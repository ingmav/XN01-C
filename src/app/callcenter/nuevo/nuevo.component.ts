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
import { CallcenterService } from '../callcenter.service';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {

  Nodo:number = 0;
  Editar:number = 0;
  Edicion:number = 0;
  NodoSeleccionado:number = 0;
  IndiceSeleccionado:number;
  Nodos:any[] = [ [], [0,1,2,3,4,5], [0,1,2,3,4,5], [0,1,2,3,4,5] ];
  TamanoArreglo:number = 0;
  TipoLona:number = 0;
  Tipo:number = 0;
  Superficie:number = 0;
  NotasSuperficie:string = "";
  Calidad:number = 0;
  NotasCalidad:string = "";
  Cantidad:number = 0;
  Base:number = 0;
  Altura:number = 0;
  reqInstalacion:number = 0;
  LugarInstalacion:number = 0;
  requerimiento:number = 0;
  NotasInstalacion:string = "";

  lista:any = [];
  Funcion:number = 1;
  Guardados:any[] = [];

  ListaTipo:any = [{'id':0, 'desc': 'SELECCIONAR'},{'id':1, 'desc': 'Espectaculares'}, {'id':2, 'desc':'Rotulación' }, {'id':3, 'desc':'Impresión de Tarjetas' }];
  ListaTipoLona:any = [{'id':0, 'desc': 'SELECCIONAR'},{'id':1, 'desc': 'LONA FRONT'}, {'id':2, 'desc':'LONA MESH' }, {'id':3, 'desc':'LONA BACKLITE' }];
  ListaSuperficie:any = [{'id':0, 'desc': 'SELECCIONAR'},{'id':1, 'desc': 'ESTRUCTURA DE METAL'}, {'id':2, 'desc':'ESTRUCTURA DE MADERA' }, {'id':3, 'desc':'PARED' }, {'id':4, 'desc':'CRISTAL' }, {'id':5, 'desc':'RIGIDO' }];
  ListaCalidad:any = [{'id':0, 'desc': 'SELECCIONAR'},{'id':1, 'desc': 'ECONÓMICA'}, {'id':2, 'desc':'GRAN FORMATO' }, {'id':3, 'desc':'DIGITAL' }, {'id':4, 'desc':'FOTOGRÁFICA' }, {'id':5, 'desc':'ALTA RESOLUCIÓN' }];
  Preguntas:any = ["", "SI", "NO"];
  Lugar:any = ["", 'LOCAL', 'FORANEA'];
  Requerimiento:any = ["", 'INSTALACIÓN', 'DESINSTALACION', 'INSTALACIÓN Y DESINSTALACIÓN'];

  // # SECCION: Esta sección es para mostrar mensajes
  mensajeError: Mensaje = new Mensaje();
  mensajeExito: Mensaje = new Mensaje();

  constructor(
    private title: Title,
    private callcenternService:CallcenterService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.title.setTitle("COTIZADOR");
    this.mensajeError = new Mensaje();
    this.mensajeExito = new Mensaje();
  }

  ver_nodos():void{
    this.NodoSeleccionado = this.Tipo;
    this.IndiceSeleccionado = 1;
    this.Nodo = this.Nodos[this.NodoSeleccionado][this.IndiceSeleccionado];
    this.TamanoArreglo = (this.Nodos[this.NodoSeleccionado].length - 1);
    this.limpiar_campos();
    //this.NodoSeleccionado = this.Nodos[Nodo][1];
    //console.log(this.NodoSeleccionado);
  }

  limpiar_campos():void{
    this.TipoLona = 0;
    //this.Tipo = 0;
    this.Superficie = 0;
    this.NotasSuperficie = "";
    this.Calidad = 0;
    this.NotasCalidad = "";
    this.Cantidad = 0;
    this.Base = 0;
    this.Altura = 0;
    this.reqInstalacion = 0;
    this.LugarInstalacion = 0;
    this.requerimiento = 0;
    this.NotasInstalacion = "";
    this.Funcion = 2;

    
  }

  nuevo():void{
    this.Funcion = 2;
    this.Tipo = 0;
    this.ver_nodos();
  }

  eliminar(indice):void
  {
    if(confirm("¿Realmente desea eliminar este elemento?"))
    {
      this.lista.splice(indice, 1);
    }
  }

  siguiente():void
  {
    console.log(this.Tipo);
    if(this.verificaForm())
    {
      this.IndiceSeleccionado++;
      this.Nodo = this.Nodos[this.NodoSeleccionado][this.IndiceSeleccionado];
    }
  }

  anterior():void
  {
    this.IndiceSeleccionado--;
    this.Nodo = this.Nodos[this.NodoSeleccionado][this.IndiceSeleccionado];
  }

  guardar():void{
    //console.log(this.Tipo);
    if(this.verificaForm())
    {
      let arreglo:any = { 'tipo' : this.Tipo, "tipoLona": this.TipoLona, 'superficie': this.Superficie, 'notasSuperficie': this.NotasSuperficie, 'calidad': this.Calidad, 'notasCalidad': this.NotasCalidad, 'cantidad': this.Cantidad, 'base': this.Base, 'altura':this.Altura, 'reqInstalacion': this.reqInstalacion, 'lugarInstalacion': this.LugarInstalacion, 'requerimiento': this.requerimiento, 'notasInstalacion': this.NotasInstalacion  }; 
      if(this.Edicion == 0)
      {
        this.lista.push(arreglo);
      }else
      {
        this.lista[this.Editar] = arreglo;
      }
      this.Edicion = 0;
      this.Editar = 0;
      this.Funcion = 1;
    }
  }

  editar(indice):void
  {
    let obj = this.lista[indice];
    //console.log(obj);
    this.TipoLona = obj.tipoLona;
    this.Tipo = obj.tipo;
    this.Superficie = obj.superficie;
    this.NotasSuperficie = obj.notasSuperficie;
    this.Calidad = obj.calidad;
    this.NotasCalidad = obj.notasCalidad;
    this.Cantidad = obj.cantidad;
    this.Base = obj.base;
    this.Altura = obj.altura;
    this.reqInstalacion = obj.reqInstalacion;
    this.LugarInstalacion = obj.lugarInstalacion;
    this.requerimiento = obj.requerimiento;
    this.NotasInstalacion = obj.notasInstalacion;

    console.log(this.TipoLona);
    this.Editar = indice;
    this.Edicion = 1;
    this.Funcion = 2;
    this.NodoSeleccionado = obj.tipo;
    this.IndiceSeleccionado = 1;
    this.Nodo = this.Nodos[this.NodoSeleccionado][this.IndiceSeleccionado];
    this.TamanoArreglo = (this.Nodos[this.NodoSeleccionado].length - 1);
  }

  verificaForm():boolean
  {
    switch(this.Nodo)
    {
      case 1:
        if(this.TipoLona == 0)
        {
          alert("debe de seleccionar el tipo de lona");
          return false;
        } 
      break;
      case 2:
        if(this.Superficie == 0)
        {
          alert("debe de seleccionar la superficie");
          return false;
        } 
      break;
      case 3:
        if(this.Calidad == 0)
        {
          alert("debe de seleccionar la calidad");
          return false;
        } 
        return true;
      case 4:
        let bandera = 1;
        if(this.Cantidad <= 0)
        {
          bandera = 0;
        }
        if(this.Base <= 0)
        {
          bandera = 0;
        }
        if(this.Altura <= 0)
        {
          bandera = 0;
        } 

        if(bandera == 0)
        {
          alert("debe de ingresar cantidades mayores a cero");
          return false;
        }
      break;
      case 5:
        let bandera_instalacion = 1;
        if(this.reqInstalacion == 1)
        {
          if(this.LugarInstalacion == 0 || this.requerimiento == 0)
          {
            alert("debe de seleccionar los datos del formulario");
            return false;
          }
          return true;
        }else if(this.reqInstalacion == 0)
        {
          alert("debe de seleccionar si requiere instalación");
          return false;
        } 
        return true;
    }
    return true;
  }
  

  verificarPrecios():void
  {

  }

}
