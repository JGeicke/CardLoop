import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from '@angular/fire/firestore';
import {Module} from './module.model';
import {AlertController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {map} from 'rxjs/operators';
import {Question} from './question.model';

@Injectable({
    providedIn: 'root'
})
export class ModuleService {

    modules: Module[] = [];

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
                private alertController: AlertController) {
        for (let i = 0; i < 5; i++) {
            this.lessons.push(this.lesson);
        }
        this.currLesson = this.testmodelesson;
    }

    lessonDetails(id) {
        console.log(id);
    }

    importLesson(id) {
        // Das imported ist nur zum testen und kann dann ersetzt werden.
        if (this.imported === false) {
            console.log('importlesson called');
            this.imported = !this.imported;
        }
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
        const uid = this.authService.GetUID();
        if (uid !== '') {
            this.firestore.collection('userModules').doc(uid).get().toPromise().then((res) => {
                moduleIds = res.data().modules;
            }).then(() => {
                return Promise.all(moduleIds.map(i => this.getModule(i)));
                /*moduleIds.forEach((i) => {
                  await this.getModule(i);
                });*/
            });
        }
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
            this.modules.push(new Module(uid, res.data().description, res.data().name, res.data().tags));
        }).then(() => {
            this.modules.map((i) => {
                this.getModuleQuestions(i);
            });
        }).then(() => {
            console.log(this.modules[0]);
        });
    }


    deleteLesson(currLesson) {
        console.log(currLesson);
    }
}

