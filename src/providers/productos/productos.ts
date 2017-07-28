import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { URL_SERVICIOS } from "../../config/url.servicios";

@Injectable()
export class ProductosProvider {

  pagina:number = 0;
  productos:any[] = [];
  lineas:any[] = [];
  por_categoria:any[] = [];

  constructor(public http: Http) {
    this.cargar_todos();
    this.cargar_lineas();
  }

  cargar_por_categoria( categoria:number ){
    // Falta implementar el infinite scroll
    let url = URL_SERVICIOS + "/productos/por_tipo/" + categoria;
    this.http.get( url )
        .map( resp => resp.json() )
        .subscribe( data => {
          console.log(data.productos);
          this.por_categoria = data.productos;
        });
  }

  cargar_lineas(){
    let url = URL_SERVICIOS + "/lineas";
    this.http.get(url)
      .map( resp=>resp.json() )
      .subscribe( data=>{
        if(data.error){
          //Aqui hay un error
        }else{
          this.lineas = data.lineas;
          console.log(this.lineas);
        }
      });
  }

  cargar_todos(){
    let promesa = new Promise( (resolve,reject)=>{
      let url = URL_SERVICIOS + "/productos/todos/" + this.pagina;
      this.http.get(url)
      .map( resp => resp.json() )
      .subscribe( data => {
        //console.log(data);
        if(data.error){
          //Aqui hay un error
        }else{
          if(data.productos.length == 0){
            console.log("Ya no existe registros");
            //this.mostrar_toast("Ya no existe registros");
            resolve(false);
            return;
          }
          let nuevaData = this.agrupar(data.productos,2);
          this.productos.push( ...nuevaData );
          //this.productos.push( ...data.productos );
          this.pagina += 1;
        }
        resolve(true);
      });
    });
    return promesa;
  }

  private agrupar(arr:any, tamano:number){
    let nuevoArreglo = [];
    for (let i = 0; i < arr.length; i+=tamano) {
        nuevoArreglo.push( arr.slice(i, i+tamano) );
    }
    //console.log(nuevoArreglo);
    return nuevoArreglo;
  }

}
