import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AlertController, Platform, ModalController } from "ionic-angular";
import { Storage } from '@ionic/storage';
import { UsuarioProvider } from "../usuario/usuario";

import { CarritoPage, LoginPage } from "../../pages/index.paginas";

@Injectable()
export class CarritoProvider {
  items:any[] = [];

  constructor(public http: Http,
              private alertCtrl: AlertController,
              private platform: Platform,
              private storage: Storage,
              private _usuario: UsuarioProvider,
              private modalCtrl: ModalController) {
    console.log('Hello CarritoProvider Provider');
    this.cargar_storage();
  }

  ver_carrito(){
    let modal:any;
    if(this._usuario.token){
      //Mostrar carrito
      modal = this.modalCtrl.create(CarritoPage);
    }else{
      //Mostrar login
      modal = this.modalCtrl.create(LoginPage);
    }
    modal.present();
    //let modal = this.modalCtrl.create(LoginPage);
    modal.onDidDismiss( (abrirCarrito:boolean) => {
      if(abrirCarrito){
        this.modalCtrl.create(CarritoPage);
      }
    });
  }

  agregar_carrito( item_parametro:any ){
    for(let item of this.items){
      if(item.codigo == item_parametro.codigo){
        this.alertCtrl.create({
          title: "Item existe",
          subTitle: item_parametro.producto + ", ya se encuentra en su carrito de compras",
          buttons: ["OK"]
        }).present();
        return;
      }
    }
    this.items.push(item_parametro);
    this.guardar_storage();
  }

  private guardar_storage(){
    if(this.platform.is("cordova")){
      // dispositivo
      this.storage.set('items', this.items);
    }else{
      // escritorio
      localStorage.setItem("items", JSON.stringify(this.items));
    }
  }

  cargar_storage(){
    let promesa = new Promise( (resolve, reject) =>{
      if(this.platform.is("cordova")){
        // dispositivo
        this.storage.get('items').then((val) => {
          if(val){
              this.items = val;
          }
          resolve();
        });
      }else{
        // escritorio
        if(localStorage.getItem("items")){
          this.items = JSON.parse(localStorage.getItem("items"));
        }
        resolve();
      }
    });
    return promesa;
  }

}
