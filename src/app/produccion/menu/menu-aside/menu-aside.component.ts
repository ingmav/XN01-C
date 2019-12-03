import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'produccion-menu-aside',
  templateUrl: './menu-aside.component.html',
  styleUrls: ['./menu-aside.component.css']
})
export class MenuAsideComponent implements OnInit {

  usuario: any = {}
  menu: any[] = [];
  menuProduccion: any[] = [];
  constructor() { }

  ngOnInit() {
    let usuario = JSON.parse(localStorage.getItem('usuario'));
    var permisos =  usuario.permisos.split('|');

    this.menu = [
      {
        titulo: 'Registro',
        modulos: [
          
        ]
      }];
    this.menuProduccion = [
      {
        titulo: 'Procesos de Producción',
        modulos: [
          { permiso: '5kiSdt98HBK4FYWqz3wuFXSUPj9AR7PA', icono: 'fa-check-square-o', titulo: 'Trabajos en Espera', url: '/produccion/lista' },
          { permiso: '5kiSdt98HBK4FYWqz3wuFXSUPj9AR7PA', icono: 'fa-paint-brush', titulo: 'Diseño', url: '/produccion/diseno' },
          { permiso: '5kiSdt98HBK4FYWqz3wuFXSUPj9AR7PA', icono: 'fa-print', titulo: 'Impresion Gran Formato', url: '/produccion/impresion-gf' },
          { permiso: '5kiSdt98HBK4FYWqz3wuFXSUPj9AR7PA', icono: 'fa-print', titulo: 'Impresion Digital', url: '/produccion/impresion-digital' },
          { permiso: '5kiSdt98HBK4FYWqz3wuFXSUPj9AR7PA', icono: 'fa-truck', titulo: 'Preparación, Instalación y Entrega', url: '/produccion/terminados' },
          { permiso: '5kiSdt98HBK4FYWqz3wuFXSUPj9AR7PA', icono: 'fa-address-card', titulo: 'Maquilas', url: '/produccion/maquilas' },
          { permiso: '5kiSdt98HBK4FYWqz3wuFXSUPj9AR7PA', icono: 'fa-list-alt', titulo: 'Tablero de Control', url: '/produccion/tablero' }
        ]
      }];
    

    
    
    if (permisos.length > 0){    
      for (var i in this.menu){
       
        for (var j in this.menu[i].modulos){
          siguienteItemProtegido: 
          for (var k in permisos){
            if (permisos[k] == this.menu[i].modulos[j].permiso){
              var item = this.initmenuProduccionPorItem(this.menu[i].titulo)
              item.modulos.push(this.menu[i].modulos[j]);      

              break siguienteItemProtegido;
            }           
          }
        }

      }
    }
  }

  initmenuProduccionPorItem(titulo: string){
     for (var i in this.menuProduccion){
       if (titulo == this.menuProduccion[i].titulo){
        return this.menuProduccion[i];
       }
     }

     this.menuProduccion.push({ titulo: titulo, modulos: []})
     return this.menuProduccion[this.menuProduccion.length - 1];

  }

}
