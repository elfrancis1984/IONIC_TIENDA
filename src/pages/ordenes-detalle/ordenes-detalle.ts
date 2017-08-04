import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CarritoProvider } from "../../providers/carrito/carrito";

@Component({
  selector: 'page-ordenes-detalle',
  templateUrl: 'ordenes-detalle.html',
})
export class OrdenesDetallePage {

  orden:any = {};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _carrito: CarritoProvider) {
    this.orden = this.navParams.get("orden");
  }

  borrar_orden( orden_id:string){
    this._carrito.borrar_orden(orden_id)
                 .subscribe( data => {
                   if(data.error){
                     //mensaje de error
                   }else{
                     this.navCtrl.pop();
                   }
                 });
  }

}
