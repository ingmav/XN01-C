import { Component, OnInit } from '@angular/core';
import { Location}           from '@angular/common';
import { ActivatedRoute, Params }   from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AuthService } from '../../../auth.service';

import { RolesService }       from '../../roles/roles.service';
import { UsuariosService }       from '../usuarios.service';

import { Rol }       from '../../roles/rol';
import { Usuario }       from '../usuario';
import { Mensaje } from '../../../mensaje'

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  usuario: FormGroup;
  
  
  id:string;
  usuarioRepetido:boolean = false;
  usuarioInvalido:boolean = false;
  cambiarPassword:boolean = false;
  respuestaRequerida:boolean = false;

  datosCargados: boolean = false;
  cargando: boolean = false;
  cargandoRoles: boolean = false;
  cargandoCatalogos: boolean = false;
  cargandoTemas: boolean =false;
  cargandoJurisdicciones: boolean =false;
  /*cargandoUnidadesMedicas: boolean = false;*/

  catalogosCargados:number = 0;
  
  roles: Rol[] = [];
  /*unidadesMedicas: any[] = [];
  medicos: any[] = [];
  unidadesMedicasEdicion:any[]  = [];*/

  jurisdicciones: Rol[] = [];
  temas: any[] = [];
  temasAgregados: any[] = [];
  temasAgragadas: any[] = [];
  jurisdiccion: any[] = [];

   // # SECCION: Esta sección es para mostrar mensajes
  mensajeError: Mensaje = new Mensaje()
  mensajeAdvertencia: Mensaje = new Mensaje()
  mensajeExito: Mensaje = new Mensaje();
  // # FIN SECCION

  constructor(
    private router: Router,
    private title: Title, 
    private authService:AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private rolesService: RolesService,
    private usuariosService: UsuariosService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.title.setTitle("Editar usuario / Panel de control");
    this.usuario = this.fb.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      id: ['', [Validators.required]],
      cambiarPassword:[false,[]],
      password: [{value: '', disabled: true}, [Validators.required]],
      confirmarPassword: [{value: '', disabled: true}, [Validators.required]],
      avatar: ['avatar-circled-user-male'],
      roles: [[1],[Validators.required]],
      temas: [[]],
      id_jurisdiccion: ['-1'],
      pregunta_secreta: [''],
      respuesta: ['']
    });

    this.route.params.subscribe(params => {
      this.id = params['id']; // Se puede agregar un simbolo + antes de la variable params para volverlo number
      //this.cargarDatos();
    });

    this.cargarRoles();
    this.cargarTemas();
    this.cargarJurisdicciones();
    
    this.cargandoCatalogos = false;
  }
  

  toggleCambiarPassword(){
    this.cambiarPassword = !this.cambiarPassword

    if(this.cambiarPassword){
      this.usuario.get('password').enable();
      this.usuario.get('confirmarPassword').enable();
    } else {
      this.usuario.get('password').disable();
      this.usuario.get('confirmarPassword').disable();
    }
    
  }

  enviar() {
    
    if (this.usuario.get('password').value != this.usuario.get('confirmarPassword').value) {
      return false;
    }
    this.cargando = true;    
    let usuario = this.usuario.value;
    if(!this.cambiarPassword){
      delete usuario.cambiarPassword;
    }
    this.usuariosService.editar(this.id,this.usuario.value).subscribe(
        usuario => {
          this.cargando = false;

          this.respuestaRequerida = false;
          
          this.mensajeExito = new Mensaje(true);
          this.mensajeExito.texto = "Se han guardado los cambios.";
          this.mensajeExito.mostrar = true;
        },
        error => {
          this.cargando = false;
          
          this.mensajeError = new Mensaje(true);
          this.mensajeError.texto = "No especificado.";
          this.mensajeError.mostrar = true;      
          
          try {
            let e = error.json();
            if (error.status == 401 ){
              this.mensajeError.texto = "No tiene permiso para hacer esta operación.";
            }
            // Problema de validación
            if (error.status == 409){
              this.mensajeError.texto = "Por favor verfique los campos marcados en rojo.";
              this.usuarioRepetido = false;
              this.usuarioInvalido = false;
              this.respuestaRequerida = false;

              for (var input in e.error){
                // Iteramos todos los errores
                for (var i in e.error[input]){

                  if(input == 'id' && e.error[input][i] == 'unique'){
                    this.usuarioRepetido = true;
                  }
                  if(input == 'id' && e.error[input][i] == 'email'){
                    this.usuarioInvalido = true;
                  }
                  if(input == 'respuesta' && e.error[input][i] == 'required'){
                    
                    this.respuestaRequerida = true;
                  }
                }                      
              }
            }
          } catch(e){
                        
            if (error.status == 500 ){
              this.mensajeError.texto = "500 (Error interno del servidor)";
            } else {
              this.mensajeError.texto = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.";
            }            
          }

        }
      );
  }


cargarJurisdicciones(){
  this.cargandoJurisdicciones = true;
  this.usuariosService.carga_catalogos().subscribe(
    resultado => {
      this.jurisdiccion = resultado.jurisdiccion;
      this.cargandoJurisdicciones = false;
      this.catalogosCargados++;
      
      if(this.catalogosCargados >1 ){
        this.cargarDatos();
      }
    }, error => {
      this.cargandoJurisdicciones = false;
    }

  );
}

cargarTemas(){
  this.cargandoTemas = true;
  this.usuariosService.carga_catalogos().subscribe(
    resultado => {
      this.temas = resultado.tema;
      this.cargandoTemas = false;
      this.catalogosCargados++;
      if(this.catalogosCargados >1 ){
        this.cargarDatos();
      }
    }, error => {
      this.cargandoTemas = false;
    }

  );
}

  cargarDatos() {
    this.cargando = true; 
    
    this.usuariosService.ver(this.id).subscribe(
        usuario => {
          this.datosCargados = true;
          
          this.usuario.patchValue(usuario);
          
          console.log(usuario);
          this.temasAgregados = usuario.usuario_tema;
          
          for(var i in this.temasAgregados){
                //this.temasAgragadas.push(this.temasAgregados[i].id);
                this.usuario.controls['temas'].setValue(this.temasAgregados);  
          }
          this.cargando = false; 
        
        },
        error => {
          this.cargando = false;
          
          this.mensajeError = new Mensaje(true);
          this.mensajeError = new Mensaje(true);
          this.mensajeError.mostrar;

          try {
            let e = error.json();
            if (error.status == 401 ){
              this.mensajeError.texto = "No tiene permiso para hacer esta operación.";
            }
            
          } catch(e){
                        
            if (error.status == 500 ){
              this.mensajeError.texto = "500 (Error interno del servidor)";
            } else {
              this.mensajeError.texto = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.";
            }            
          }
          

        }
      );
  }
  
  cargarRoles() {
    this.cargandoRoles = true;
    this.rolesService.lista().subscribe(
        roles => {
          this.cargandoRoles = false;

          this.roles = roles;
          if (this.roles.length == 0){
            this.mensajeAdvertencia = new Mensaje(true);
            this.mensajeAdvertencia.texto = `
            No hay roles registrados en el sistema, póngase en contacto con un administrador.`;
            this.mensajeAdvertencia.mostrar = true;
          }
        },
        error => {
          this.cargandoRoles = false;
          
          this.mensajeError = new Mensaje(true);
          this.mensajeError.texto = "No especificado.";
          this.mensajeError.mostrar = true;
          
          this.cargarDatos();
          
          try {
            let e = error.json();
            if (error.status == 401 ){
              this.mensajeError.texto = "No tiene permiso para ver los roles.";
            }

            if (error.status == 500 ){
             
              this.mensajeError.texto = "500 (Error interno del servidor). No se pudieron cargar los roles";
            }
          } catch(e){
            console.log("No se puede interpretar el error");
            
            if (error.status == 500 ){
             
              this.mensajeError.texto = "500 (Error interno del servidor). No se pudieron cargar los roles";
            } else {
              this.mensajeError.texto = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.  No se pudieron cargar los roles";
            }            
          }
          

        }
      );
  }

  regresar(){
    this.location.back();
  }



}
