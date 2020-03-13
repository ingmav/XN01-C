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
        titulo: 'Procesos de Producción',
        modulos: [
          { permiso: 'nzHzp0gz4wOA6q7oJmllQGRfencZw92d', icono: 'fa-check-square-o', titulo: 'Trabajos en Espera', url: '/produccion/lista' },
          { permiso: 'VVUmMn5z5OZ2U2gE9h8osymi93HEjxpK', icono: 'fa-paint-brush', titulo: 'Diseño', url: '/produccion/diseno' },
          { permiso: 'MmKDlGTTmfCWOCVIoSlNX4qN96EFDMBA', icono: 'fa-print', titulo: 'Impresion Gran Formato', url: '/produccion/impresion-gf' },
          { permiso: 'IoBPFfYRYXr0oTkiFLjZS7wdlmh75ySJ', icono: 'fa-file-o', titulo: 'Impresion Digital', url: '/produccion/impresion-digital' },
          { permiso: 'DezCUjFR54fvGMScTrVO77ceBVSzB2Nf', icono: 'fa-truck', titulo: 'Preparación, Instalación y Entrega', url: '/produccion/terminados' },
          { permiso: 'RYUiHOsJ78t172DRmsfcasKXc3rIyKMw', icono: 'fa-address-card', titulo: 'Maquilas', url: '/produccion/maquilas' },
          { permiso: 'PzVYnzkMdBHzBpK63thGwPoMqQFCHIkl', icono: 'fa-list-alt', titulo: 'Tablero de Control', url: '/produccion/tablero' }
        ]
      }];
    this.menuProduccion = [
      {
        titulo: 'Procesos de Producción',
        modulos: [
         
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
