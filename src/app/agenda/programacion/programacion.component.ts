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
import { AgendaService } from '../agenda.service';

@Component({
  selector: 'app-programacion',
  templateUrl: './programacion.component.html',
  styleUrls: ['./programacion.component.css']
})
export class ProgramacionComponent implements OnInit {

  lista:any[] = [];
  listaDias:any[] = [];
  cargando:boolean = false;
  showAgendar:boolean = false;
  item_seleccionado:any = { 'ventas': { 'cliente': {}}};
  tab_pestana:number = 1;
  datos_agenda:any = { id:0, tipo: 2, actividad:0,  fecha_diseno: '', dato_diseno:'', fecha_impresion_gf: '', dato_impresion_gf:'', fecha_impresion_digital: '', dato_impresion_digital:'', fecha_preparacion: '', dato_preparacion:'', fecha_instalacion: '', dato_instalacion:'', fecha_entrega: '', dato_entrega:'', fecha_maquila: '', dato_maquila:''};
  
  dias:any[] = [ '', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

  catalogo_equipo:any = {};
  catalogo_trabajador:any;
  agenda_produccion:any = { produccion_id: 0, diseno: '', impresion_gf: '', impresion_digital: '', preparacion:'', instalacion: '', entrega:'', maquila:''}
   // # SECCION: Esta sección es para mostrar mensajes
   mensajeError: Mensaje = new Mensaje();
   mensajeExito: Mensaje = new Mensaje();
  
  constructor(
    private title: Title,
    private agendaService:AgendaService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.title.setTitle("Agenda del Sistema");
    this.mensajeError = new Mensaje();
    this.mensajeExito = new Mensaje();

    this.listarAgenda();
    this.catalogos();
  }

  listarAgenda():void{
    
    this.cargando = true;
    this.agendaService.listar().subscribe(
      resultado => {
        console.log(resultado);
        this.listaDias = resultado.periodo;
        this.lista = resultado.trabajos;
        this.cargando = false;
      },
      error => {
        this.cargando = false;
        this.mensajeError.mostrar = true;
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

  agendarActividad(item)
  {
    
    this.showAgendar = true;
    this.tab_pestana = 1;
    //console.log(item);
    this.item_seleccionado = item;
    this.datos_agenda = { id:0, tipo: 2, actividad:0,  fecha_diseno: '', dato_diseno:'', fecha_impresion_gf: '', dato_impresion_gf:'', fecha_impresion_digital: '', dato_impresion_digital:'', fecha_preparacion: '', dato_preparacion:'', fecha_instalacion: '', dato_instalacion:'', fecha_entrega: '', dato_entrega:'', fecha_maquila: '', dato_maquila:''};
    //console.log(this.item_seleccionado);
    let items =  this.item_seleccionado.produccion_agenda;
    for (let i = 0; i < items.length; i++) {
        switch(items[i].tipo_produccion)
        {
          case 1:
            this.datos_agenda.fecha_diseno = items[i].fecha;
            this.datos_agenda.dato_diseno  = items[i].trabajador_id;
          break;
          case 2:
            this.datos_agenda.fecha_impresion_gf = items[i].fecha;
            this.datos_agenda.dato_impresion_gf  = items[i].equipo_id;
          break;
          case 3:
            this.datos_agenda.fecha_impresion_digital = items[i].fecha;
            this.datos_agenda.dato_impresion_digital  = items[i].equipo_id;
          break;
          case 4:
            this.datos_agenda.fecha_preparacion = items[i].fecha;
            this.datos_agenda.dato_preparacion  = items[i].trabajador_id;
          break;
          case 5:
            this.datos_agenda.fecha_instalacion = items[i].fecha;
            this.datos_agenda.dato_instalacion  = items[i].trabajador_id;
          break;
          case 6:
            this.datos_agenda.fecha_entrega = items[i].fecha;
            this.datos_agenda.dato_entrega  = items[i].trabajador_id;
          break;
          case 7:
            this.datos_agenda.fecha_maquila = items[i].fecha;
            this.datos_agenda.dato_maquila  = items[i].trabajador_id;
          break;
        }
    }
  }

  pestana(valor)
  {
    this.tab_pestana = valor;
      /*switch(valor)
      {
        case 1:
          this.tab_pestana = 1;
        break;
        case 2:
          this.tab_pestana = 2; 
        break;
      }*/
  }

  finalizar_actividad(actividad)
  {
    if(confirm("¿Desea finalizar esta actividad?"))
    {
      let obj = { 'id': this.item_seleccionado.id, 'actividad': actividad, 'tipo': 1 };
      this.agendaService.guardar_actividad(obj).subscribe(
        resultado => {
          this.listarAgenda();
          console.log(resultado);
          this.item_seleccionado = resultado;
        },
        error => {
          this.cargando = false;
          this.mensajeError.mostrar = true;
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

  guardar_agenda(actividad)
  {
    //console.log(this.datos_agenda);

    if(confirm("¿Desea guardar esta actividad?"))
    {
      //let obj = { 'id': this.item_seleccionado.id, 'actividad': actividad };
      this.datos_agenda.id = this.item_seleccionado.id;
      this.datos_agenda.actividad = actividad;
      this.agendaService.guardar_actividad(this.datos_agenda).subscribe(
        resultado => {
          this.listarAgenda();
          //this.showAgendar = false;
          //console.log(resultado);
          //this.item_seleccionado = resultado;
        },
        error => {
          this.cargando = false;
          this.mensajeError.mostrar = true;
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


  catalogos()
  {
    this.agendaService.catalogos().subscribe(
      resultado => {
          this.catalogo_equipo = resultado.equipo;
          this.catalogo_trabajador = resultado.trabajador;
          //console.log(this.catalogo_trabajador);
      },
      error => {
       this.cargando = false;
        this.mensajeError.mostrar = true;
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

  eliminar(id)
  {
    if(confirm("¿Desea eliminar esta actividad?"))
    {
      //let obj = { 'id': this.item_seleccionado.id, 'actividad': actividad };
      this.agendaService.eliminar_actividad(id).subscribe(
        resultado => {
          this.listarAgenda();
         
        },
        error => {
          this.cargando = false;
          this.mensajeError.mostrar = true;
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
}
