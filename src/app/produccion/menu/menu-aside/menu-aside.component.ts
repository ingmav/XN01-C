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
          { permiso: 'HC8qcdKns2j6CI0rox9s1EbzmsIDXhHH', icono: 'fa-check-square-o', titulo: 'Trabajos en Espera', url: '/produccion/lista' },
          { permiso: 'HC8qcdKns2j6CI0rox9s1EbzmsIDXhHH', icono: 'fa-paint-brush', titulo: 'Diseño', url: '/produccion/diseno' },
          { permiso: 'HC8qcdKns2j6CI0rox9s1EbzmsIDXhHH', icono: 'fa-print', titulo: 'Impresion', url: '/produccion/impresion' },
          { permiso: 'HC8qcdKns2j6CI0rox9s1EbzmsIDXhHH', icono: 'fa-truck', titulo: 'Preparación, Instalación y Entrega', url: '/produccion/terminados' },
          { permiso: 'HC8qcdKns2j6CI0rox9s1EbzmsIDXhHH', icono: 'fa-address-card', titulo: 'Maquilas', url: '/produccion/maquilas' },
          { permiso: 'HC8qcdKns2j6CI0rox9s1EbzmsIDXhHH', icono: 'fa-list-alt', titulo: 'Tablero de Control', url: '/produccion/tablero' }
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
