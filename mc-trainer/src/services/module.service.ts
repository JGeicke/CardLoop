import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from '@angular/fire/firestore';
import {Module} from './module.model';
import {AlertController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {map} from 'rxjs/operators';
import {Question} from './question.model';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ModuleService {

    userModules: Module[] = [];
    allModules: Module[] = [];
    public currLesson: Module;
    public lessons = [];

    constructor(private firestore: AngularFirestore,
                private authService: AuthService,
                private alertController: AlertController,
                private router: Router) {
        this.getAllModules();
        this.currLesson = this.allModules[0];
    }


    async delDialog() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Please confirm!',
            message: '<p>This item will and all associated ' +
                'data will be deleted. This action cannot be undone. </p>',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Okay',
                    handler: () => {
                        this.deleteLesson(this.currLesson);
                        this.alertController.dismiss({
                            dismissed: true
                        });
                    }
                }
            ]
        });

        await alert.present();
    }

    // loads all Modules that the currently logged in User has already imported


    getUserModules() {
        let moduleIds = [];
        const uid = this.authService.GetUID();
        if (uid != '') {
            this.firestore.collection('userModules').doc(uid).get().toPromise().then((res) => {
                moduleIds = res.data().modules;
            }).then(() => {
                this.userModules = [];
                return Promise.all(moduleIds.map(i => this.getUserModule(i)));
                /*moduleIds.forEach((i) => {
                  await this.getModule(i);
                });*/
            });
        }
    }

    // loads all Modules that are currently stored in the Database
    getAllModules() {
        let moduleIds = [];
        this.allModules = [];
        this.firestore.collection('modules').get().toPromise().then((res) => {
            res.forEach(a => {
                moduleIds.push(a.id);
            });
        }).then(() => {
            return Promise.all(moduleIds.map(i => this.getModule(i)));
            /*moduleIds.forEach((i) => {
              await this.getModule(i);
            });*/
        });

    }

    // loads the questions from the database and adds them to the given Module
    private getModuleQuestions(module: Module) {
        this.firestore.collection('modules').doc(module.uid).collection('questions').get().toPromise().then((res) => {
            res.forEach(doc => {
                const data = doc.data();
                module.questions.push(new Question(data.uid, data.question, data.answers, data.solutions));
            });
        });
    }


    private getModule(uid: string) {
        this.firestore.collection('modules').doc(uid).get().toPromise().then((res) => {
            this.allModules.push(new Module(uid, res.data().description, res.data().name, res.data().tags));
        }).then(() => {
            this.allModules.map((i) => {
                this.getModuleQuestions(i);
            });
        }).then(() => {
            console.log(this.allModules[this.allModules.length-1]);
        });
    }


    private getUserModule(uid: string) {
        this.firestore.collection('modules').doc(uid).get().toPromise().then((res) => {
            this.userModules.push(new Module(uid, res.data().description, res.data().name, res.data().tags));
        }).then(() => {
            this.userModules.map((i) => {
                this.getModuleQuestions(i);
            });
        }).then(() => {
            console.log(this.userModules[this.userModules.length-1]);
        });
    }

    // checks if the given module is already importted by the user that is logged in
    isModuleImported(module: Module): boolean{
        for (const m of this.userModules) {
            if (m.uid === module.uid) {
                return true;
            }
        }
        return false;
    }

    deleteLesson(currLesson) {
        console.log(currLesson);
    }

    importModule(module: Module){
        const userID = this.authService.GetUID();
        // check if any user is logged in
        if (userID != ''){
            let uModuleIDs = [];
            for (let m of this.userModules){
                uModuleIDs.push(m.uid);
            }
            uModuleIDs.push(module.uid);
            this.firestore.collection('userModules').doc(userID).update({'modules': uModuleIDs}).then(() => {
                this.getUserModules;
            });
        }   else {
            // if noone is logged in
            // show promt to let a user log on register
            this.importLoginConflicktModal();
        }
    }

    // shows promt to redirect to the login page or cancel the action
    async importLoginConflicktModal(){
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Not Logged in!',
            message: '<p>You need to LogIn to import Modules! ' +
                ' </p>',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                    }
                }, {
                    text: 'LogIn',
                    handler: () => {
                        this.router.navigate(['login']);

                    }
                }
            ]
        });

        await alert.present();
    }
}

