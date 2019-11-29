import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';

import { Rol }       from '../../roles/rol';


@Component({
  selector: 'panel-control-usuarios-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor() { }

  @Input() roles: Rol[];
  @Input() temas: any[];
  @Input() temasUsuario: any = [];
  @Input() jurisdiccion: any[];
  @Input() usuario:FormGroup;

  @Input()  respuestaRequerida:boolean;
  @Input()  usuarioRepetido:boolean;
  @Input()  usuarioInvalido:boolean;
  @Input()  cargando: boolean;
  @Input()  cargandoRoles: boolean;
  @Input()  cargandoMedicos: boolean;
  @Input()  mostrarCambiarPassword:boolean;

  @Output() onEnviar = new EventEmitter<void>();
  @Output() onRegresar = new EventEmitter<void>();
  @Output() onToggleCambiarPassword = new EventEmitter<void>();
  @Output() onCargarRoles = new EventEmitter<void>();
  @Output() onCargarTemas = new EventEmitter<void>();
  @Output() onCargarJurisdicciones = new EventEmitter<void>();

  // # Esto es solo para listar las unidades medicas que ya estan relacionadas
  // al usuario, en el modulo de edicion
  @Input() temasAgregados: any[];

  tab:number = 1;

  /**
   * Método que inicializa y obtiene valores para el funcionamiento del componente.
   */
  ngOnInit() {
    this.temasAgregados = this.temasUsuario;
  }

  enviar() {
    this.onEnviar.emit();
  }
  cargarRoles(){
     this.onCargarRoles.emit();
  }
  cargarTemas(){
    this.onCargarTemas.emit();
 }

 cargarJurisdicciones(){
  this.onCargarJurisdicciones.emit();
}

  regresar() {
    this.onRegresar.emit();
  }

  toggleCambiarPassword() {
    this.onToggleCambiarPassword.emit();
  }



  agregarTema(tema){
    let ban:number = 0;
    for(var i in this.temas){
      
      if(this.temas[i].id == tema){
        for(var j in this.temasAgregados){
          if(this.temasAgregados[j].id == tema){
            ban++;
          }

        }
        if(ban == 0)
        {
          this.temasAgregados.push(this.temas[i]);
          
          this.usuario.controls['temas'].setValue(this.temasAgregados);  
        }
      }
    }
    
  }

  eliminarTema(event,item,index){
    event.preventDefault();
    event.stopPropagation();
    confirm("¿Realmente desea eliminar el tema?")
    {
      this.temasAgregados.splice(index, 1);
      this.usuario.controls['temas'].setValue(this.temasAgregados); 
    }
  }

  
}
