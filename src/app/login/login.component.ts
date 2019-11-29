import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

import { AuthService } from '../../app/auth.service';
import { BloquearPantallaService }     from '../bloquear-pantalla/bloquear-pantalla.service';


import { ESTA_SALUD_ID_DISPONIBLE } from '../../app/config';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  saludIdDisponible: boolean;
  credenciales: any = {};
  loading: boolean = false;
  returnUrl: string;
  mensaje: string = "";
  mostrarMensaje: boolean = false;
  bloquearPantallaSuscription: Subscription;
  tamano = document.body.clientHeight;

  mostrarRecuperarPassword:boolean = false;
  resetPasswordViaToken:boolean = false;

  resetPasswordPayload: any = {
    id:null,
    reset_token:null
  }
  cliente_version:string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService:AuthService,
    private bloquearPantallaService: BloquearPantallaService
  ) { 
    this.bloquearPantallaSuscription = bloquearPantallaService.pantallaBloqueada$.subscribe(bloquear => {
      // Borramos el token porque de todos modos se va a sustituir
      // y así impedimos que intenten borrar elementos en el navegador para acceder
      if(!bloquear){
        console.log("Redirigiendo desde login por desbloqueo de pantalla")
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([this.returnUrl]);        
      }
      
    });
  }

  ngOnInit() {
    this.saludIdDisponible = ESTA_SALUD_ID_DISPONIBLE;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    if(this.route.snapshot.queryParams['reset_password']=='true'){      
      this.resetPasswordPayload.id = this.route.snapshot.queryParams['id'] || '';
      this.resetPasswordPayload.reset_token = this.route.snapshot.queryParams['reset_token'] || '';
      this.mostrarRecuperarPassword = true;
      this.resetPasswordViaToken = true;
    }

    this.cliente_version = environment.VERSION;
    
  }
  login() {
    this.loading = true;
    this.mostrarMensaje = false;

    this.authService.login(this.credenciales.id, this.credenciales.password)
      .subscribe(
        data => {
          let usuario = JSON.parse(localStorage.getItem("usuario"));
          this.loading = false;
          if(usuario.modulo_inicio){
            this.router.navigate([usuario.modulo_inicio]);
          }else{
            this.router.navigate([this.returnUrl]);
          }
          localStorage.removeItem('bloquear_pantalla');
        },
        error => {
          this.loading = false;
          this.mostrarMensaje = true;
          
          this.mensaje = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.";
          try {
            let e = error.json();
            
            if (error.status == 401){
              this.mensaje = "Lo sentimos el usuario y/o contraseña no son válidos."
            }

            if (error.status == 0){
              this.mensaje = "Conexión rechazada."
            }

            if (error.status == 500 ){
              this.mensaje = "500 (Error interno del servidor)";
            } 
          } catch(e){
            if (error.status == 500 ){
              this.mensaje = "500 (Error interno del servidor)";
            } 
          }
          
        }
      );
  }

}
