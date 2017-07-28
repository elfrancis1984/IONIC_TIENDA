import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductosProvider } from "../../providers/index.providers";
import { ProductoPage } from "../producto/producto";

@Component({
  selector: 'page-por-categorias',
  templateUrl: 'por-categorias.html',
})
export class PorCategoriasPage {

  categoria:any = {};
  productoPage = ProductoPage;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _productos: ProductosProvider) {
    this.categoria = this.navParams.get("linea");
    this._productos.cargar_por_categoria(this.categoria.id);
  }


}
