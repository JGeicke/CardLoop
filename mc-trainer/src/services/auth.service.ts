import { Injectable } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from './user.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedin = false;
  constructor() { }

  private user: User;
  isLoggedIn = false;
  constructor(private firebaseAuth: AngularFireAuth, private firestore: AngularFirestore) {
  }

  async Register(email: string, password: string): Promise<string>{
      let errorCode: string;
      await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
        .then((result) => {
          this.SetUser(result.user);
          // Erzeugt neues UserModules Dokument
          this.firestore.collection('userModules').doc(result.user.uid).set({modules: []});
          errorCode = '';
        }).catch((err) => {
          errorCode = err.code;
        });
      return Promise.resolve(errorCode);
  }

  async SignIn(email: string, password: string): Promise<string>{
    let errorCode;
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
        .then((result) => {
          this.SetUser(result.user);
          this.isLoggedIn = true;
          errorCode = '';
        }).catch((error) => {
          errorCode = error.code;
        });
    return Promise.resolve(errorCode);
  }

  SignOut(){
      this.user = null;
      this.isLoggedIn = false;
  }

  GetUID(): string{
      if (this.user != null){
          return this.user.uid;
      } else {
          return '';
      }
  }

  private SetUser(user){
    this.user = new User(user.uid, user.email, user.password);
    console.log(this.user);
  }
}
