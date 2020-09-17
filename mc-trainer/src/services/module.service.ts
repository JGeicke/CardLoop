import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from '@angular/fire/firestore';
import {Module} from './module.model';
import {AlertController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {map} from 'rxjs/operators';
import {Question} from './question.model';
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class ModuleService {

    userModules: Module[] = [];
    allModules: Module[] = [];
    public currLesson;
    public lessons = [];
    // Testdaten können später ersetzt werden, nur für FrontEnd Dev
    private testmodelesson: Module =
        {
            uid: '1', name: 'Capitols of Africa',
            description: 'interesting facts about africa',
            questions: [{
                uid: '1', question: 'Was ist die Hauptstadt von Kamerun?',
                answers: ['Jaunde', 'Maunde', 'Kalaunde', 'Schmaunde', 'Banaunde', 'Zigande'],
                solutions: [0]
            }],
            tags: ['Geography', 'Capitol', 'Africa']
        };


    private lesson = {name: 'Compilerbau', cards: 42, tags: ['Programming', 'Computer Science', 'Something more']};
    imported = false;

    constructor(private firestore: AngularFirestore,
                private authService: AuthService,
                private alertController: AlertController,
                private router: Router) {
        for (let i = 0; i < 5; i++) {
            this.lessons.push(this.lesson);
        }
        this.currLesson = this.testmodelesson;
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

    getUserModules() {
        let moduleIds = [];
        this.userModules = [];
        const uid = this.authService.GetUID();
        if (uid != '') {
            this.firestore.collection('userModules').doc(uid).get().toPromise().then((res) => {
                moduleIds = res.data().modules;
            }).then(() => {
                return Promise.all(moduleIds.map(i => this.getUserModule(i)));
                /*moduleIds.forEach((i) => {
                  await this.getModule(i);
                });*/
            });
        }
    }

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

    isModuleImported(module: Module): boolean{
        for (const m of this.userModules) {
            if (m.uid === module.uid)
                return true
        }
        return false;
    }

    deleteLesson(currLesson) {
        console.log(currLesson);
    }

    importModule(module: Module){
        const userID = this.authService.GetUID();
        // const userID = 'd2EoVNFP3bT53S3o2ptVqfdBouR2';
        if (userID != ''){
            let uModuleIDs = [];
            for (let m of this.userModules){
                uModuleIDs.push(m.uid);
            }
            uModuleIDs.push(module.uid);
            this.firestore.collection('userModules').doc(userID).update({'modules': uModuleIDs});
        }   else {
            this.importLoginConflicktModal();
        }
    }

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
                        console.log('Confirm Cancel: blah');
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

