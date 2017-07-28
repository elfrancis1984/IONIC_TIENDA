import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UsuarioProvider {

  token:string;
  id_usuario:string;

  constructor(public http: Http) {
    console.log('Hello UsuarioProvider Provider');
  }

}
