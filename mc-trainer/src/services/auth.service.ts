import {Injectable} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from './user.model';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    registerTriggered = false;
    private user: User;
    isLoggedIn = false;

    constructor(private firebaseAuth: AngularFireAuth, private alertController: AlertController,
                private firestore: AngularFirestore, private router: Router) {
    }

    async Register(email: string, password: string): Promise<string> {
        let errorCode: string;
        await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
            .then((result) => {
                this.SetUser(result.user, password);
                // Erzeugt neues UserModules Dokument
                this.firestore.collection('userModules').doc(result.user.uid).set({modules: []});
                errorCode = '';
            }).catch((err) => {
                errorCode = err.code;
            });
        return Promise.resolve(errorCode);
    }

    async SignIn(email: string, password: string): Promise<string> {
        let errorCode;
        await this.firebaseAuth.signInWithEmailAndPassword(email, password)
            .then((result) => {
                this.SetUser(result.user, password);
                this.isLoggedIn = true;
                errorCode = '';
            }).catch((error) => {
                errorCode = error.code;
            });
        return Promise.resolve(errorCode);
    }

    SignOut() {
        this.user = null;
        this.isLoggedIn = false;
        localStorage.setItem('user', null);
        this.router.navigate(['login']);
    }

    GetUID(): string {
        if (this.user != null) {
            return this.user.uid;
        } else {
            return '';
        }
    }

    private SetUser(user, password) {
        this.user = new User(user.uid, user.email, password);
    }

    rememberUser() {
        localStorage.setItem('user', JSON.stringify(this.user));
    }

    checkPassword(password: string): boolean {
        console.log(this.user.password);
        console.log(password);
        return this.user.password === password;
    }

    getUserMail(): string {
        return this.user.email;
    }

    changePassword(password: string) {
        const user = this.firebaseAuth.currentUser.then((user) => {
            user.updatePassword(password).then((err) => {
                this.showDialog('Your Password was successfully changed!');
            });
        });
    }

    async showDialog(text: string) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Succes',
            message: '<p>' + text + 'd</p>',
            buttons: [
                {
                    text: 'OK',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                    }
                }

            ]
        });

        await alert.present();
    }

    async startDeleteUser() {
        let returnBoolean = false;
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Confirmation',
            message: '<p>Are you sure you want to delete your account?</p>',
            buttons: [
                {
                    text: 'NO',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                    }
                },
                {
                    text: 'YES',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('delete')
                        this.deleteUser();
                        returnBoolean = true;
                    }
                }

            ]
        });

        await alert.present();
        return Promise.resolve(returnBoolean);

    }

    deleteUser() {
        this.firebaseAuth.currentUser.then((user) => {
            user.delete().then(() => {
                this.SignOut();
                this.showDialog('Your Account was deleted!');
                this.router.navigate(['login']);
            });
        });
    }

    toggleRegister(): boolean {
        return this.registerTriggered;
    }
}
