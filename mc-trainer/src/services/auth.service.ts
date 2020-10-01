import {Injectable} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from './user.model';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {StatisticService} from './statistic.service';
import {ModuleService} from './module.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    registerTriggered = false;
    private user: User;
    isLoggedIn = false;

    constructor(private firebaseAuth: AngularFireAuth, private alertController: AlertController,
                private firestore: AngularFirestore, private router: Router, private statisticService: StatisticService) {
    }

    /**
     * registers a new user in the firebase Auth and returns the thrown error or '' if no error occured
     * @param email the new usere's email
     * @param password  the new usere's password
     * @constructor
     */
    async Register(email: string, password: string): Promise<string> {
        let errorCode: string;
        let uid: string;
        await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
            .then((result) => {
                uid = result.user.uid;
                // Erzeugt neues UserModules Dokument
                this.firestore.collection('userModules').doc(result.user.uid).set({modules: []});
                errorCode = '';
            }).catch((err) => {
                errorCode = err.code;
            });
        if (uid !== undefined && errorCode === ''){
            // inits user document in userStats collection
            await this.statisticService.initUserStats(uid);
        }
        return Promise.resolve(errorCode);
    }

    /**
     * signs in an already existing user with the firebase Auth returns the thrown error or '' if no error occured
     * @param email the user's Email
     * @param password the users's password
     * @constructor
     */
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

    /**
     * signs out the current user and redirects them to the login page
     * @constructor
     */
    SignOut() {
        this.user = null;
        this.isLoggedIn = false;
        localStorage.removeItem('user');
        this.router.navigate(['login']);
    }

    /**
     * returns the UID of the currently logged in user or '' if no user is logged in at the moment
     * @constructor
     */
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

    /**
     * saves the current user in the local storage
     */
    rememberUser() {
        localStorage.setItem('user', JSON.stringify(this.user));
    }

    /**
     * checks if the given password is identical with the password of the currently logged in user
     * @param password the password that will be checked
     */
    checkPassword(password: string): boolean {
        return this.user.password === password;
    }

    /**
     * returns the email of the currently logged in user or null if no user is logged in
     */
    getUserMail(): string {
        return this.user.email;
    }

    /**
     * updates the password of the currently logged in user
     * @param password the new password
     */
    changePassword(password: string) {
        const user = this.firebaseAuth.currentUser.then((user) => {
            user.updatePassword(password).then((err) => {
                this.showDialog('Your Password was successfully changed!');
            });
        });
    }

    /**
     * shows a succes alert message
     * @param text the text inside of the alert
     */
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

    /**
     * shows the confirmation alert before the user can delete his/her account
     */
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
                        console.log('delete');
                        this.deleteUser();
                        returnBoolean = true;
                    }
                }

            ]
        });

        await alert.present();
        return Promise.resolve(returnBoolean);

    }

    /**
     * delets the current user
     */
    private deleteUser() {
        this.firebaseAuth.currentUser.then((user) => {
            user.delete().then(() => {
                this.SignOut();
                this.showDialog('Your Account was deleted!');
                this.router.navigate(['login']);
            });
        });
    }

    /**
     * checks if redirected directly to registartion
     */
    toggleRegister(): boolean {
        return this.registerTriggered;
    }
}
