import { Injectable } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import {User} from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedin = false;
  constructor() { }

  private user: User;
  constructor(private firebaseAuth: AngularFireAuth) {}

  Register(email: string, password: string){
    this.firebaseAuth.createUserWithEmailAndPassword(email, password)
        .then((result) => {
          this.SetUser(result.user);
        }).catch((err) => {
          // Handle error
    });
  }

  SignIn(email: string, password: string){
    return this.firebaseAuth.signInWithEmailAndPassword(email, password)
        .then((result) => {
          this.SetUser(result.user);
        }).catch((error) => {
          // do stuff
        });
  }

  private SetUser(user){
    this.user = new User(user.uid, user.email, user.password);
    console.log(this.user);
  }
}
