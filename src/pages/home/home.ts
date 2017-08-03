import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ProductosProvider, CarritoProvider, UsuarioProvider }  from "../../providers/index.providers";
import { ProductoPage } from "../producto/producto";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  hayMas:boolean = true;
  productoPage = ProductoPage;

  constructor(public navCtrl: NavController,
              private _productos: ProductosProvider,
              private _carrito: CarritoProvider,
              private _usuario: UsuarioProvider) {

  }

  siguiente_pagina( infiniteScroll ){
    this._productos.cargar_todos()
      .then( (existenMas:boolean)=>{
        infiniteScroll.complete();
        this.hayMas = existenMas;
      });
  }

}
