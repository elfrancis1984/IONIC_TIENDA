import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import { AlertController, Platform, ModalController } from "ionic-angular";
import { Storage } from '@ionic/storage';
import { UsuarioProvider } from "../usuario/usuario";

import { CarritoPage, LoginPage } from "../../pages/index.paginas";
import { URL_SERVICIOS } from "../../config/url.servicios";

@Injectable()
export class CarritoProvider {
  items:any[] = [];
  total_carrito:number = 0;
  ordenes:any[] = [];

  constructor(public http: Http,
              private alertCtrl: AlertController,
              private platform: Platform,
              private storage: Storage,
              private _usuario: UsuarioProvider,
              private modalCtrl: ModalController) {
    console.log('Hello CarritoProvider Provider');
    this.cargar_storage();
    this.actualizar_total();
  }

  remover_item(idx:number){
    this.items.splice(idx,1);
    this.guardar_storage();
    this.actualizar_total();
  }

  realizar_pedido(){
    let data = new URLSearchParams();
    let codigos:string[] = [];

    for(let item of this.items){
      codigos.push(item.codigo);
    }
    //console.log(codigos);
    data.append("items", codigos.join(","));
    let url = `${ URL_SERVICIOS }/pedidos/realizar_orden/${ this._usuario.token}/${ this._usuario.id_usuario}`;
    this.http.post(url, data)
             .subscribe( resp => {
               let respuesta = resp.json();
               if(respuesta.error){
                 //mostrar alerta con mensaje de error
                 this.alertCtrl.create({
                   title: 'Error',
                   subTitle: respuesta.mensaje,
                   buttons: ["OK"]
                 }).present();
               }else{
                 //todo bien
                 this.items = [];
                 this.alertCtrl.create({
                   title: 'Exito',
                   subTitle: 'Pedido realizado con exito!',
                   buttons: ["OK"]
                 }).present();
               }
             });
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
        this.modalCtrl.create(CarritoPage).present();
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
    this.actualizar_total();
  }

  actualizar_total(){
    this.total_carrito = 0;
    for(let item of this.items){
      this.total_carrito += Number(item.precio_compra);
    }
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

  cargar_ordenes(){
    let url = `${URL_SERVICIOS}/pedidos/obtener_pedidos/${this._usuario.token}/${this._usuario.id_usuario}`;
    this.http.get(url)
              .map( resp => resp.json())
              .subscribe( data => {
                if(data.error){
                  //mensaje de error
                  console.log(data.mensaje);
                }else{
                  //ok
                  console.log(data.ordenes);
                  this.ordenes = data.ordenes;
                }
              });
  }

  borrar_orden(orden_id:string){
    let url = `${ URL_SERVICIOS}/pedidos/borrar_pedido/${this._usuario.token}
/${this._usuario.id_usuario}/${orden_id}`;
    return this.http.delete(url).map( resp => resp.json());
  }

}
