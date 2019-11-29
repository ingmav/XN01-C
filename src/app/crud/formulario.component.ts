import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';

import { Title } from '@angular/platform-browser';

import { AuthService } from '../auth.service';
import { CrudService } from './crud.service';

import { Mensaje } from '../mensaje';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'formulario',
    template: `<simple-notifications [options]="options"></simple-notifications>
    <div class="modal" id="confirmarEliminar">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
            <p class="modal-card-title"><i class="fa fa-warning"></i> Alerta</p>
            <button class="delete" (click)="cancelarModal()"></button>
            </header>
            <section class="modal-card-body">
                <div class="content">
                    <h1>¿Esta seguro de eliminar el elemento?</h1>
                    <p>Ya no se podra recuperar la información</p>
                </div>
            </section>
            <footer class="modal-card-foot">
            <a class="button is-success" (click)="borrar(borrarItem)" [ngClass]="{'is-loading': borrarCargando}">Continuar</a>
            <a class="button" (click)="cancelarModal()">Cancelar</a>
            </footer>
        </div>
    </div>
    `
})
export class FormularioComponent implements OnInit {
    borrarCargando: boolean = false;
    /**
     * Calcula el tamaño de la pantalla
     */
    tamano = document.body.clientHeight;

    id: string;
    moduloTitulo: string;
    datosCargados: boolean = true;
    cargando: boolean = false;
    cambiarPassword: boolean = false;

    derecha: any[] = [];
    izquierda: any[] = [];
    // Crear la variable que mustra las notificaciones
    mensajeResponse: Mensaje = new Mensaje()

    // Varaibles de entrada se pasan los valores desde la vista
    @Input() URL: string;
    @Input() titulo: string;
    @Input() dato: FormGroup;

    /**
     * Este método inicializa la carga de las dependencias
     * que se necesitan para el funcionamiento del modulo
     */
    constructor(
        private router: Router,
        private title: Title,
        private authService: AuthService,
        private route: ActivatedRoute,
        private location: Location,
        private crudService: CrudService,
        private fb: FormBuilder,
        private notificacion: NotificationsService
    ) { }
    /**
     * Este método se dispara al iniciar la carga de la vista asociada
     * @return void
     */
    ngOnInit() {
        this.title.setTitle(this.titulo);
        this.route.params.subscribe(params => {
            this.id = params['id']; // Se puede agregar un simbolo + antes de la variable params para volverlo number
            if (this.id)
                this.cargarDatos();
        });

        this.moduloTitulo = this.id ? 'Modificar' : 'Nuevo';
    }

    /**
    * Este método envia es intermediario y determina si un elemento es nuevo
    * o solo se esta editando
    * @return void
    */
    enviar(regresar: boolean = true, editar: string = '',redirigirAVer: string = '') {
        try {
            if (this.id) {
                this.actualizarDatos(editar);
            } else {
                this.guardarDatos(regresar, editar, redirigirAVer);
            }
        } catch (e) {
            console.log('Mal');
        }
    }

    /**
    * Este método envia los datos para agregar un elemento
    * @return void
    */
    guardarDatos(regresar, editar,redirigirAVer: string = '') {

        this.cargando = true;
        var json = this.dato.getRawValue();
        this.crudService.crear(json, this.URL).subscribe(
            resultado => {
                this.cargando = false;
                if (regresar) {
                    this.location.back();
                }
                if(redirigirAVer != ''){
                    this.router.navigate([redirigirAVer + "/"+ resultado.id]);
                }
                if (editar && json.estatus === 'BR') {
                    this.router.navigate([editar, resultado.id]);
                }
                if (editar && json.estatus === 'FI') {
                    this.router.navigate([editar]);
                }

                this.mensajeResponse.texto = 'Se han guardado los cambios.';
                this.mensajeResponse.mostrar = true;
                this.mensajeResponse.clase = 'success';
                this.mensaje(2);
            },
            error => {
                this.cargando = false;
                if (error.status === 500) {
                    this.mensajeResponse.texto = '500 (Error interno del servidor)';
                    this.mensajeResponse.mostrar = true;
                    this.mensajeResponse.clase = 'error';
                    this.mensaje(3);
                }

                try {
                    let e = error.json();
                    if (error.status == 401) {
                        this.mensajeResponse.texto = 'No tiene permiso para hacer esta operación.';
                    }
                    // Problema de validación
                    if (error.status === 409) {
                        try {
                            for (let input in e.error) {
                                if (e.error.hasOwnProperty(input)) {
                                    for (let i in e.error[input]) {
                                        if (e.error[input].hasOwnProperty(i)) {
                                            for (let a in e.error[input][i]) {
                                                if (e.error[input][i].hasOwnProperty(a)) {
                                                    this.mensajeResponse.titulo = a;
                                                    this.mensajeResponse.texto = e.error[input][i][a];
                                                    this.mensajeResponse.clase = 'error';
                                                    this.mensaje(3);
                                                } else {
                                                    this.mensajeResponse.titulo = input;
                                                    this.mensajeResponse.texto = e.error[input][i];
                                                    this.mensajeResponse.clase = 'error';
                                                    this.mensaje(3);
                                                }
                                            }
                                        }
                                    }
                                }
                                // Iteramos todos los errores
                                /* for (var i in e.error[input]) {
                                    this.mensajeResponse.titulo = input;
                                    this.mensajeResponse.texto = e.error[input][i];
                                    this.mensajeResponse.clase = 'error';
                                    this.mensaje(3);
                                }*/
                            }
                        } catch (e) {
                            this.mensajeResponse.texto = 'Por favor verfique los campos marcados en rojo.';
                            this.mensajeResponse.clase = 'warning';
                            this.mensaje(8);
                        }
                    }
                } catch (e) {
                    this.mensajeResponse.texto = 'No especificado.';
                    this.mensajeResponse.mostrar = true;
                    this.mensajeResponse.clase = 'error';
                    this.mensaje(3);
                    console.log(e);

                    if (error.status == 500) {
                        this.mensajeResponse.texto = '500 (Error interno del servidor)';
                    } else {
                        this.mensajeResponse.texto = 'No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.';
                    }
                }
            }
        );
    }
    /**
     * Este método envia los datos para actualizar un elemento con el id
     * que se envia por la url
     * @return void
     */
    actualizarDatos(editar) {
        this.cargando = true;
        let dato;
        try {
            dato = this.dato.getRawValue();
        }catch (e) {
            dato = this.dato.value;
        }
        if (!this.cambiarPassword) {
            delete dato.cambiarPassword;
        }

        this.crudService.editar(this.id, dato, this.URL).subscribe(
             resultado => {
            //     if (dato.status === 'FI') {
            //         this.location.back();
            //         this.router.navigate(['almacen/entradas-estandar']);
            //     }
                if (editar && dato.estatus === 'FI') {
                    this.router.navigate([editar]);
                }
                this.cargando = false;

                this.mensajeResponse.texto = 'Se han guardado los cambios.';
                this.mensajeResponse.mostrar = true;
                this.mensajeResponse.clase = 'success';
                this.mensaje(2);
            },
            error => {
                this.cargando = false;

                this.mensajeResponse.texto = 'No especificado.';
                this.mensajeResponse.mostrar = true;
                this.mensajeResponse.clase = 'alert';
                this.mensaje(2);
                try {
                    let e = error.json();
                    if (error.status == 401) {
                        this.mensajeResponse.texto = 'No tiene permiso para hacer esta operación.';
                        this.mensajeResponse.clase = 'error';
                        this.mensaje(2);
                    }
                    // Problema de validación
                    if (error.status == 409) {
                        this.mensajeResponse.texto = 'Por favor verfique los campos marcados en rojo.';
                        this.mensajeResponse.clase = 'error';
                        this.mensaje(8);
                        for (let input in e.error) {
                            // Iteramos todos los errores
                            for (let i in e.error[input]) {
                                this.mensajeResponse.titulo = input;
                                this.mensajeResponse.texto = e.error[input][i];
                                this.mensajeResponse.clase = 'error';
                                this.mensaje(3);
                            }
                        }
                    }
                } catch (e) {
                    if (error.status == 500) {
                        this.mensajeResponse.texto = '500 (Error interno del servidor)';
                    } else {
                        this.mensajeResponse.texto = 'No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.';
                    }
                    this.mensajeResponse.clase = 'error';
                    this.mensaje(2);
                }

            }
        );
    }

    /**
     * Este método es recursivo y recorre todo el formulario reactivo para crear los que son de tipo array y agregar su respectivo valor
     * @param resultado json con los datos del objecto resultado de la consulta a la base de datos
     * @param data formulario reactivo donde se guardaran los valores resultantes
     * @return void
     */
    cargarDatosRecursivo(resultado, data) {
        try {
            // validar si el resultado es un array para recorrer de manera unica
            if (Array.isArray(resultado)) {
                try {
                    var posicionx = 0;
                    const valoresx = [];

                    resultado.forEach(ax => {
                        if (typeof ax === "object") {

                            var xx = {};
                            for (let key1x in ax) {
                                if (ax[key1x] || (key1x != 'created_at' && key1x != 'updated_at' && key1x != 'deleted_at')) {
                                    xx[key1x] = ax[key1x];
                                }
                            }
                            var xtx = []; var tieneDatosx = false;
                            for (let key1x in xx) {
                                if (Array.isArray(xx[key1x])) {
                                    if (!xtx[key1x])
                                        xtx[key1x] = [];
                                    xtx[key1x].push(xx[key1x]);
                                    xx[key1x] = this.fb.array([]);
                                    tieneDatosx = true;
                                }
                            }

                            // agregar todos los controles sin excepcion
                            data.push(this.fb.group(xx));
                            // recorrer los controles en busca de los que son de tipo array

                            if (tieneDatosx) {
                                // obtener el control para agregar un nuevo control
                                const x2x = <FormArray>data.controls[posicionx];
                                for (let xrx in xtx) {
                                    for (let x1x in xtx[xrx]) {
                                        // crear el form array en caso de que el dato sea un array
                                        x2x.controls[x1x] = new FormArray([]);
                                        // obtener su control
                                        const x3x = <FormArray>x2x.controls[xrx];
                                        // llamar el metodo recursivo para llegar al ultimo array en la lista
                                        this.cargarDatosRecursivo(xtx[xrx][x1x], x3x);
                                    }
                                }
                            } else {
                                return;
                            };
                        } else {
                            valoresx.push(ax);
                        }
                        posicionx++;
                    });
                    if (valoresx.length > 0)
                        data.patchValue(valoresx);
                } catch (e) {
                    console.log(2, e);
                    return;
                }
            } else {
                try {
                    // recorrer los controles del formulario y agregar su respectivo valor
                    for (let key in resultado) {
                        // validar que exista en la declaracion del fromulario
                        if (data.controls[key]) {
                            // validar si es un array

                            if (Array.isArray(resultado[key])) {
                                var valores = [];
                                const control = <FormArray>data.controls[key];
                                var posicion1 = 0, posicion2 = 0;
                                // recorrer los items del array para validar si no hay mas array
                                try {
                                    for (let a1 in resultado[key]) {
                                        var a = resultado[key][a1];
                                        // si es un objeto crear un fromgroup o un nuevo array
                                        if (typeof a === "object") {
                                            var x = {};
                                            for (let key1 in a) {
                                                if (a[key1] || (key1 != 'created_at' && key1 != 'updated_at' && key1 != 'deleted_at')) {
                                                    x[key1] = a[key1];
                                                }
                                            }
                                            var xt = []; var tieneDatos = false;
                                            for (let key1 in x) {
                                                if (Array.isArray(x[key1])) {
                                                    if (!xt[key1])
                                                        xt[key1] = [];
                                                    xt[key1].push(x[key1]);
                                                    x[key1] = this.fb.array([]);
                                                    tieneDatos = true;
                                                }
                                            }

                                            // agregar todos los controles sin excepcion
                                            control.push(this.fb.group(x));
                                            // recorrer los controles en busca de los que son de tipo array
                                            try {
                                                if (tieneDatos) {
                                                    // obtener el control para agregar un nuevo control
                                                    const x2 = <FormArray>control.controls[posicion1];

                                                    for (let xr in xt) {
                                                        for (let x1 in xt[xr]) {
                                                            // crear el form array en caso de que el dato sea un array
                                                            x2.controls[x1] = new FormArray([]);
                                                            // obtener su control
                                                            const x3 = <FormArray>x2.controls[xr];

                                                            // llamar el metodo recursivo para llegar al ultimo array en la lista
                                                            this.cargarDatosRecursivo(xt[xr][x1], x3);
                                                        }
                                                    }
                                                }
                                            } catch (e) {
                                                console.log(5, e);
                                                return data;
                                            }
                                        }
                                        else {
                                            valores.push(a);
                                        }
                                        posicion1++;
                                    }
                                    if (valores.length > 0) {
                                        control.patchValue(valores);
                                    }
                                } catch (e) {
                                    console.log(4, e);
                                    return;
                                }
                            } else {
                                if (resultado[key]){
                                    var tiene = 0;
                                    var tiene_array = 0;
                                    if(typeof resultado[key] == "object"){
                                       for (let a1 in resultado[key]){
                                           if (Array.isArray(resultado[key][a1])) {
                                               tiene_array++;
                                           }
                                        }
                                        if(tiene_array == 0)
                                            data.controls[key].patchValue(resultado[key]);
                                    }
                                    if (tiene_array > 0 || Array.isArray(resultado[key])){
                                        for (let a1 in resultado[key]){
                                            const x1 = <FormArray>data.controls[key];

                                            if (Array.isArray(resultado[key][a1])) {
                                                const x2 = <FormArray>x1.controls[a1];
                                                // llamar el metodo recursivo para llegar al ultimo array en la lista
                                                this.cargarDatosRecursivo(resultado[key][a1], x2);
                                            }
                                            else {
                                                if(a1 != 'created_at' && a1 != 'updated_at' && a1 != 'deleted_at')
                                                    x1.controls[a1].patchValue(resultado[key][a1]);
                                            }
                                        }
                                    }
                                    if(tiene == 0)
                                        if(key != 'created_at' && key != 'updated_at' && key != 'deleted_at')
                                            data.controls[key].patchValue(resultado[key]);
                                }
                                else {
                                    data.controls[key].patchValue('');
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.log(3, e);
                    return;
                }
            }
            return data;
        } catch (e) {
            console.log(1, e);
            return;
        }
    }

    reset_form() {
        this.dato.reset();
        for (let item in this.dato.controls) {
            const ctrl = <FormArray>this.dato.controls[item];
            if (ctrl.controls) {
                if (typeof ctrl.controls.length == 'number') {
                    while (ctrl.length) {
                        ctrl.removeAt(ctrl.length - 1);
                    }
                    ctrl.reset();
                }
            }
        }
        return true;
    }

    /**
     * Este método carga los datos de un elemento de la api con el id que se pase por la url
     * en la api, abre una ventana modal para confirmar la acción
     * @return void
     */
    cargarDatos() {
        if (this.reset_form()) {
            try {
                this.cargando = true;

                this.crudService.ver(this.id, this.URL).subscribe(
                    resultado => {
                        this.cargando = false;
                        this.datosCargados = true;
                        // validar todos los key que tengan el array
                        this.dato.patchValue(this.cargarDatosRecursivo(resultado, this.dato));

                        this.mensajeResponse.titulo = 'Modificar';
                        this.mensajeResponse.texto = 'Los datos se cargaron';
                        this.mensajeResponse.clase = 'success';
                        this.mensaje(2);
                    },
                    error => {
                        this.cargando = false;
                        this.datosCargados = false;

                        this.mensajeResponse = new Mensaje(true);
                        this.mensajeResponse = new Mensaje(true);
                        this.mensajeResponse.mostrar;

                        try {
                            let e = error.json();
                            if (error.status == 401) {
                                this.mensajeResponse.texto = 'No tiene permiso para hacer esta operación.';
                                this.mensajeResponse.clase = 'success';
                                this.mensaje(2);
                            }

                        } catch (e) {

                            if (error.status == 500) {
                                this.mensajeResponse.texto = '500 (Error interno del servidor)';
                            } else {
                                this.mensajeResponse.texto = 'No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.';
                            }
                            this.mensajeResponse.clase = 'error';
                            this.mensaje(2);
                        }

                    }
                );
            } catch (e) {
                console.log(0, e);
            }
        }
    }


    // abre una modal para confirmar la eliminacion
    borrarItem = '';

    /**
     * Este método es intermediario para la eliminación de un elemento
     * en la api, abre una ventana modal para confirmar la acción
     * @param item contiene el valor del elemento a eliminar
     * @param index  indica la posicion del elemento en la lista cargada
     * @return void
     */
    eliminar(item: any): void {
        this.borrarItem = item;
        document.getElementById('confirmarEliminar').classList.add('is-active');
    }

    /**
     * Este método abre una modal
     * @param id identificador del elemento de la modal
     * @return void
     */
    abrirModal(id) {
        document.getElementById(id).classList.add('is-active');
    }

    /**
     * Este método cierra el modal de la de confirmación de eleimnación         
     * @return void
     */
    cancelarModal(id: string = 'confirmarEliminar') {
        document.getElementById(id).classList.remove('is-active');
    }
    /**
     * Este método se encarga de la eliminacion de un elemento
     * en la api
     * @param item contiene el valod del elemento a eliminar
     * @param index  indica la posicion del elemento en la lista cargada
     * @return void
     */
    borrar(item: any): void {
        this.borrarCargando = true;
        this.crudService.eliminar(item, this.URL).subscribe(
            data => {
                this.borrarCargando = false;

                this.mensajeResponse.mostrar = true;
                this.mensajeResponse.texto = 'Se eliminó el elemento de la lista.';
                this.mensajeResponse.clase = 'success';
                this.mensaje(2);

                this.cancelarModal();

                this.regresar();
            },
            error => {
                this.borrarCargando = false;

                this.mensajeResponse.mostrar = true;
                this.cancelarModal();

                try {
                    let e = error.json();
                    if (error.status == 401) {
                        this.mensajeResponse.texto = 'No tiene permiso para hacer esta operación.';
                        this.mensajeResponse.clase = 'danger';
                        this.mensaje(2);
                    }
                } catch (e) {
                    if (error.status == 500) {
                        this.mensajeResponse.texto = '500 (Error interno del servidor)';
                    } else {
                        this.mensajeResponse.texto = 'No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.';
                    }
                    this.mensajeResponse.clase = 'danger';
                    this.mensaje(2);
                }


            }
        );
    }


    cargarDatosCatalogo: boolean = false;
    catalogo: any[] = []; roles: any[] = [];
    /**
     * Este metodo se encarga de cargar los datos de un catalogo para crear un select, grupos de radios o check
     * @param item nombre del modelo donde se guardaron los resultados
     * @param url  ruta de la pai donde se obtienen los valores
     * @return void
     */
    cargarCatalogo(item, url, id: string = "") {
        this.cargando = true;
        this.cargarDatosCatalogo = true;
        this.crudService.lista(0, 0, url).subscribe(

            resultado => {
                if (resultado.data) {
                    resultado.data.forEach(element => {
                        if (!element.text) {
                            element.text = element.nombre;
                        }
                    });
                    this[item] = resultado.data;
                }else {
                    if (Array.isArray(resultado)) {
                        resultado.forEach(element => {
                            if (!element.text) {
                                element.text = element.nombre;
                            }
                        });
                    }
                    this[item] = resultado;
                }
                this.cargando = false;
                if (resultado.length == 0) {
                    this.mensajeResponse.titulo = item;
                    this.mensajeResponse.texto = 'Esta vacio, póngase en contacto con un administrador.';
                    this.mensajeResponse.mostrar = true;
                    this.mensajeResponse.clase = 'warning';
                    this.mensaje(3);
                }
                this.cargarDatosCatalogo = false;
                if (id != '') {
                        setTimeout(() => {
                            if (document.getElementById(id)) {
                                document.getElementById(id).click();
                            }
                        }, 500);
                }
            },
            error => {
                this.mensajeResponse = new Mensaje(true);
                this.mensajeResponse.texto = 'No especificado.';
                this.mensajeResponse.mostrar = true;

                try {

                    let e = error.json();

                    if (error.status == 401) {
                        this.mensajeResponse.texto = "No tiene permiso para ver los roles.";
                    }

                    if (error.status == 500) {

                        this.mensajeResponse.texto = "500 (Error interno del servidor). No se pudieron cargar los roles";
                    }
                } catch (e) {

                    if (error.status == 500) {

                        this.mensajeResponse.texto = "500 (Error interno del servidor). No se pudieron cargar los roles";
                    } else {
                        this.mensajeResponse.texto = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.  No se pudieron cargar los roles";
                    }
                }
                this.cargarDatosCatalogo = false;
            }
        );
    }
     
    /* cargarCatalogo(item, url) {
        this.cargando = true;
        this.cargarDatosCatalogo = true;
        this.crudService.lista(0, 0, url).subscribe(

            resultado => {
                this[item] = resultado;
                this.cargando = false;
                if (resultado.length == 0) {
                    this.mensajeResponse.titulo = item;
                    this.mensajeResponse.texto = `Esta vacio, póngase en contacto con un administrador.`;
                    this.mensajeResponse.mostrar = true;
                    this.mensajeResponse.clase = 'warning';
                    this.mensaje(3);
                }
                this.cargarDatosCatalogo = false;
            },
            error => {
                this.mensajeResponse = new Mensaje(true);
                this.mensajeResponse.texto = 'No especificado.';
                this.mensajeResponse.mostrar = true;

                try {

                    let e = error.json();

                    if (error.status == 401) {
                        this.mensajeResponse.texto = 'No tiene permiso para ver los roles.';
                    }

                    if (error.status == 500) {

                        this.mensajeResponse.texto = '500 (Error interno del servidor). No se pudieron cargar los roles';
                    }
                } catch (e) {

                    if (error.status == 500) {

                        this.mensajeResponse.texto = '500 (Error interno del servidor). No se pudieron cargar los roles';
                    } else {
                        this.mensajeResponse.texto = 'No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.  No se pudieron cargar los roles';
                    }
                }
                this.cargarDatosCatalogo = false;
            }
        );
    }*/

    /**
     * Este metodo se encarga de cargar los datos de un catalogo que depende de otro
     * @param url  ruta de la pai donde se obtienen los valores
     * @param item nombre del modelo donde se guardaron los resultados
     * @param id  id del catalogo del que depende
     * @return voidofModelo
     */
    catalogoDependiente = function (url, item, id) {
        this.cargarDatosCatalogo = true;
        this.crudService.lista(0, 0, url + '?id=' + id).subscribe(
            resultado => {
                this[item] = resultado;
                if (resultado.length == 0) {
                    this.mensajeResponse.titulo = item;
                    this.mensajeResponse.texto = `Esta vacio, póngase en contacto con un administrador.`;
                    this.mensajeResponse.mostrar = true;
                    this.mensajeResponse.clase = 'warning';
                    this.mensaje(3);
                }
                this.cargarDatosCatalogo = false;
            },
            error => {
                this.mensajeResponse = new Mensaje(true);
                this.mensajeResponse.texto = 'No especificado.';
                this.mensajeResponse.mostrar = true;

                try {

                    let e = error.json();

                    if (error.status == 401) {
                        this.mensajeResponse.texto = 'No tiene permiso para ver los roles.';
                    }

                    if (error.status == 500) {

                        this.mensajeResponse.texto = '500 (Error interno del servidor). No se pudieron cargar los roles';
                    }
                } catch (e) {

                    if (error.status == 500) {

                        this.mensajeResponse.texto = '500 (Error interno del servidor). No se pudieron cargar los roles';
                    } else {
                        this.mensajeResponse.texto = 'No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.  No se pudieron cargar los roles';
                    }
                }
                this.cargarDatosCatalogo = false;
            }
        );
    };


    /**
     * Este método regresa a una pagina anterior
     * @return void
     */
    regresar() {
        this.location.back();
    }


    /**
     * Este método agrega un id de un catalogo a un array
     * ejemplo <code>(click)="ctrl.addInFormArray(val.id, ctrl.dato.controls.permisos, true)"</code>
     * @param valor valor a agregar al array de datos
     * @param modelo  array de datos
     * @param key nombre de la clave para guardar temporal
     * @param esmodelo Bandera que determina si el modelo es un formGroup
     * @return void
     */
    modelo = [];
    addInFormArray(valor, modelo, key, esmodelo: boolean = false) {
        if (!this.modelo[key]) {
            this.modelo[key] = modelo.value;
        }
        var i = this.modelo[key].indexOf(valor);
        if (i > -1) {
            this.modelo[key].splice(i, 1);
        } else {
            this.modelo[key].push(valor);
        }

        if (!esmodelo)
            modelo = this.modelo[key];
        else
            modelo.patchValue(this.modelo[key]);

    }

    todosSeleccionados: any = [];
    /**
     * Este método agrega los ids de un elemento al listado de un modelo
     * ejemplo <code>(click)="ctrl.seleccionarTodos('admin', arrayDatos, ctrl.dato.controls.permisos, true)"</code>
     * @param clave nombre para identificar en caso de que sean muchos
     * @param valores Valores a agregar en el modelo
     * @param modelo Nombre del modelo
     * @param esmodelo Bandera que determina si el modelo es un formGroup
     * @return void
     */
    seleccionarTodos(clave, valores, modelo, esmodelo: boolean = false) {
        if (!this.todosSeleccionados[clave])
            this.todosSeleccionados[clave] = false;
        this.todosSeleccionados[clave] = !this.todosSeleccionados[clave];
        var i = 0;

        if (!esmodelo)
            this.modelo[clave] = [];
        else
            this.modelo[clave] = modelo.value;
        if (esmodelo)
            var temp = modelo.value;
        for (let item of valores) {
            if (this.todosSeleccionados[clave]) {
                this.modelo[clave].push(item.id);
            }
            else {
                if (esmodelo) {
                    temp.splice(modelo.value.indexOf(item.id), 1);
                }
                else {
                    modelo.splice(this.modelo[clave].indexOf(item.id), 1);
                }
            }
        }
        if (!esmodelo)
            modelo.push(this.modelo[clave]);
        else {
            if (this.todosSeleccionados[clave])
                modelo.patchValue(this.modelo[clave]);
            else
                modelo.patchValue(temp);
        }
    }
ofModelo
    /**
     * Este método genera un array de datos a mover de izquierda a derecha o viseversa en el control mover
     * ejemplo <code>(click)="ctrl.seleccionarTodosMover('derecha', ctrl.dato.controls.almacen_tipos_movimientos.controls)"</code>
     * @param clave  Posicion izquierda-derecha del movimiento de los datos
     * @param modelo  modelo de donde se va a seleccionar los elementos a mover
     * @return void
     */
    seleccionarTodosMover(clave, modelo) {
        if (!this.todosSeleccionados[clave])
            this.todosSeleccionados[clave] = false;
        this.todosSeleccionados[clave] = !this.todosSeleccionados[clave];

        for (let item of modelo) {
            if (this.todosSeleccionados[clave]) {
                this[clave].push(item);
            }
            else {
                this[clave].splice(this[clave].indexOf(item), 1);
            }
        }
    }

    /**
     * Este método agrega un objeto a un array de elementos para mover
     * ejemplo <code>(click)="ctrl.agregarMover('derecha', ctrl.dato.controls.almacen_tipos_movimientos.controls, item)"</code>
     * @param clave Posicion izquierda-derecha del movimiento de los datos
     * @param modelo  modelo que corresponde al array a agregar los elementos
     * @param valor valor a agregar al array
     * @return void
     */
    agregarMover(clave, modelo, valor) {
        var i = this[clave].indexOf(valor);
        if (i > -1) {
            this[clave].splice(i, 1);
        } else {
            this[clave].push(valor);
        }
    }

    /**
     * Este método verifica que el modelo de mover datos no aparezca en la lista de seleccion si existe quitarlo de izquierda
     * ejemplo
     * <code>(click)="ctrl.initMover(ctrl.dato.controls.almacen_tipos_movimientos.controls, ctrl.tipos_movimientos)"</code>
     * @param toModelo  modelo que corresponde al array a agregar los elementos
     * @param ofModelo modelo de donde se quitan los valores
     * @return void
     */
    initMover(toModelo, ofModelo, campo:string='id') {

        for (let item of toModelo) {
            var i = 0;
            for (let val of ofModelo) {
                if (item.value[campo] == val[campo]) {
                    ofModelo.splice(i, 1);
                }
                i++;
            }
        }
    }
    /**
     * Este método agrega un objeto a un array de elementos para mover
     * ejemplo
     * <code>(click)="ctrl.iniciarMover('derecha', ctrl.tipos_movimientos, ctrl.dato.controls.almacen_tipos_movimientos.controls, false, campo)"</code>
     * <code>(click)="ctrl.iniciarMover('izquierda', ctrl.dato.controls.almacen_tipos_movimientos.controls, ctrl.tipos_movimientos, true, campo)"</code>
     * @param clave Posicion izquierda-derecha del movimiento de los datos
     * @param toModelo  modelo que corresponde al array a agregar los elementos
     * @param ofModelo modelo de donde se quitan los valores
     * @param esmodelo Bandera que determina si el modelo es un formGroup
     * @param campo variable que determina el valor a comparar
     * @return void
     */
    iniciarMover(clave, toModelo, ofModelo, esmodelo: boolean = false, campo:string='id') {

             for (let item of this[clave]) {
                if (esmodelo) {
                    toModelo.push(this.fb.group(item));
                    var i = 0;

                    for (let val of ofModelo) {
                        if (item[campo] == val[campo]) {
                            ofModelo.splice(i, 1);
                        }
                        i++;
                    }
                }
                else {
                    toModelo.push(item.value);
                    var i = 0;
                    for (let val of ofModelo) {
                        if (item.value[campo] == val.value[campo]) {
                            ofModelo.splice(i, 1);
                        }
                        i++;
                    }
                }
            }

        this[clave] = [];
        if (this.todosSeleccionados[clave]){
            ofModelo = [];
        }
        this.todosSeleccionados[clave] = false;
    }

    /**
     * Este método genera una cadena de longitud determinada y la agrega a un modelo
     * ejemplo <code>(click)="ctrl.generarCadenaRandom(ctrl.dato.controls.id, 32, true)"</code>
     * @param modelo  Nombre del modelo donde se guarda la cadena
     * @param tamano  longitud de la cadena
     * @param esmodelo Bandera que determina si el modelo es un formGroup
     * @return void
     */
    generarCadenaRandom(modelo, tamano, esmodelo: boolean = false) {
        var cadena = '';
        var random = Math.floor(Math.random() * ((9999 * tamano) - 1111)) + tamano;

        for (var i = 0; i < tamano; i++) {
            random += '' + Math.floor(Math.random() * ((9999 * tamano) - 1111)) + tamano;
        }
        var tiempo = Math.round(new Date().getTime() / 1000);

        cadena = '' + tiempo + random;
        cadena = btoa(cadena);
        cadena = cadena.substr(0, cadena.length - 3);
        cadena = cadena.substr(Math.floor(Math.random() * (100 - 10)) + 1, tamano);
        if (!esmodelo)
            modelo = cadena;
        else
            modelo.patchValue(cadena);
    }

    /**
     * Este método selecciona un item y lo pasa al modelo del autocomplete para no mandar el objeto si no se requiere y mandar unicamente el valor
     * ejemplo <code>(valueChanged)="ctrl.select_item_autocomplete(ctrl.dato.controls.clues, 'clues', $event, true)"</code>
     * @param modelo Nombre del modelo donde se guarda el dato obtenido
     * @param item nombre del item a extraer del objeto
     * @param datos objeto donde se busca el elemento para su extraccion
     * @param esmodelo Bandera que determina si el modelo es un formGroup
     * @return void
     */
    select_item_autocomplete(modelo, item, datos, esmodelo: boolean = false) {
        if (!esmodelo)
            modelo = datos[item];
        else
            modelo.patchValue(datos[item]);
    }

    /**
     * Este método agrega un formgrupo a un formarray, para crear un formulario dinamico
     * ejemplo <code>(click)="ctrl.agregar_form_array(ctrl.dato.controls.almacen_tipos_movimientos.controls, form_almacen_tipos_movimientos)"</code>
     * @param modelo Nombre del modelo donde se guarda el dato obtenido
     * @param formulario Nombre del modelo donde se guarda el dato obtenido
     * @return void
     */
    agregar_form_array(modelo: FormArray, formulario) {
        (<FormArray>modelo).push(this.fb.group(formulario));
    }

    /**
     * Este método quita un formgrupo a un formarray, para crear un formulario dinamico
     * ejemplo <code>(click)="ctrl.quitar_form_array(ctrl.dato.controls.almacen_tipos_movimientos, i)"</code>
     * @param modelo Nombre del modelo donde se guarda el dato obtenido
     * @param i Posicion del elemento a eliminar
     * @return void
     */
    quitar_form_array(modelo, i: number) {
        modelo.removeAt(i);
    }

    error_archivo = false;
    /**
     * Este método selecciona una imagen de un campo file <input type="file" (change)="seleccionarImagenBase64($event, 'modelo')">
     * @param evt Evento change del campo file
     * @param modelo Modelo donde guardaremos la cadena en base64 de la imagen
     * @param multiple bandera que determina si el campo es multiple
     * @return void
     */
     seleccionarImagenBase64(evt, modelo, multiple: boolean = false) {
        var files = evt.target.files;
        var esto = this;
        esto.error_archivo = false;
        if (!multiple) {
            var file = files[0];
            if (files && file) {
                var reader = new FileReader();
                reader.readAsBinaryString(file);
                reader.onload = (function (theFile) {
                    return function (e) {
                        try {
                            modelo.patchValue(btoa(e.target.result));
                        } catch (ex) {
                            esto.error_archivo = true;
                        }
                    }
                })(file);
            }
        }
        else {
            var objeto = [];
            for (var i = 0, f; f = files[i]; i++) {
                var reader = new FileReader();
                reader.readAsBinaryString(f);
                reader.onload = (function (theFile) {
                    return function (e) {
                        try {
                            objeto.push(btoa(e.target.result));
                        } catch (ex) {
                            esto.error_archivo = true;
                        }
                    }
                })(f);
            }
            modelo.patchValue(objeto);
        }
    }
    error_json = false;
    /**
     * Este método selecciona un archivo txt con un json para subirlo <input type="file" (change)="seleccionarJson($event, 'modelo')">
     * @param evt Evento change del campo file
     * @param modelo Modelo donde guardaremos la cadena en base64 de la imagen
     * @return void
     */
    convertirJson(evt, modelo, mostrar) {
        modelo.patchValue('');
        this.error_json = false;
        var files = evt.target.files;
        var file = files[0];
        var esto = this;
        if (files && file) {
            var json = '';
            var reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (function (theFile) {
                return function (e) {
                    try {
                        json = JSON.parse(e.target.result);
                        modelo.patchValue(json);
                    } catch (ex) {
                        esto.error_json = true;
                    }
                }
            })(file);
        }
    }

    // mostrar notificaciones configuracion default, posicion abajo izquierda, tiempo 2 segundos
    public options = {
        position: ['bottom', 'left'],
        timeOut: 2000,
        lastOnBottom: true
    };
    
    /**
     * Este método muestra los mensajes resultantes de los llamados de la api
     * @param cuentaAtras numero de segundo a esperar para que el mensaje desaparezca solo
     * @param posicion  array de posicion [vertical, horizontal]
     * @return void
     */
    mensaje(cuentaAtras: number = 6, posicion: any[] = ['bottom', 'left']): void {
        var objeto = {
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: this.mensajeResponse.texto.length
        };

        this.options = {
            position: posicion,
            timeOut: cuentaAtras * 1000,
            lastOnBottom: true
        };
        if (this.mensajeResponse.titulo == '')
            this.mensajeResponse.titulo = this.titulo;

        if (this.mensajeResponse.clase == 'alert')
            this.notificacion.alert(this.mensajeResponse.titulo, this.mensajeResponse.texto, objeto);

        if (this.mensajeResponse.clase == 'success')
            this.notificacion.success(this.mensajeResponse.titulo, this.mensajeResponse.texto, objeto);

        if (this.mensajeResponse.clase == 'info')
            this.notificacion.info(this.mensajeResponse.titulo, this.mensajeResponse.texto, objeto);

        if (this.mensajeResponse.clase == 'warning' || this.mensajeResponse.clase == 'warn')
            this.notificacion.warn(this.mensajeResponse.titulo, this.mensajeResponse.texto, objeto);

        if (this.mensajeResponse.clase == 'error' || this.mensajeResponse.clase == 'danger')
            this.notificacion.error(this.mensajeResponse.titulo, this.mensajeResponse.texto, objeto);

    }

}
