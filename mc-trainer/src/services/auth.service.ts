import { Injectable } from '@angular/core';
import {ModalController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedin = false;
  constructor() { }

}
