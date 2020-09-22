import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from '@angular/fire/firestore';
import {Module} from './module.model';
import {AlertController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {filter, map} from 'rxjs/operators';
import {Question} from './question.model';

@Injectable({
    providedIn: 'root'
})
export class ModuleService {

    userModules: Module[] = [];

    public currLesson;
    /* Testdaten können später ersetzt werden, nur für FrontEnd Dev
    private testmodelesson: Module = new Module('1','interesting facts about africa', 'Capitols of Africa',)
        {
            uid: '1', name: 'Capitols of Africa',
            description: 'interesting facts about africa',
            questions: [{
                uid: '1', question: 'Was ist die Hauptstadt von Kamerun?',
                answers: ['Jaunde', 'Maunde', 'Kalaunde', 'Schmaunde', 'Banaunde', 'Zigande'],
                solutions: [1]
            }],
            tags: ['Geography', 'Capitol', 'Africa'],
            progress: 0
        };
    */

    private lesson = {name: 'Compilerbau', cards: 42, tags: ['Programming', 'Computer Science', 'Something more']};
    imported = false;

    constructor(private firestore: AngularFirestore, private authService: AuthService, private alertController: AlertController) {
    }

    lessonDetails(id, progress) {
        console.log(id);
        console.log(progress);
        this.userModules.forEach(e => console.log(e));
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

    // Gets modules of logged-in user with uid from firebase
    async getUserModules() {
        this.userModules = [];
        let moduleIds = [];
        const uid = this.authService.GetUID();
        if (uid !== '') {
            await this.firestore.collection('userModules').doc(uid).get().toPromise().then((res) => {
                moduleIds = res.data().modules;
            });
            for (const module of moduleIds){
                await this.getModule(module);
            }
            for (const module of this.userModules){
                await this.getModuleQuestions(module);
                for (const question of module.questions){
                    await this.getQuestionProgress(question);
                }
                module.calcProgress();
            }
        }

    }

    // Accesses questions of module in firebase & recreates it locally
    private getModuleQuestions(module: Module) {
        return this.firestore.collection('modules').doc(module.uid).collection('questions').get().toPromise().then((res) => {
            res.forEach(doc => {
                const data = doc.data();
                module.questions.push(new Question(doc.id, data.question, data.answers, data.solutions));
            });
        });
    }

    // Accesses module with uid in firebase & recreates it locally
    private getModule(uid: string) {
        return this.firestore.collection('modules').doc(uid).get().toPromise().then((res) => {
            this.userModules.push(new Module(uid, res.data().description, res.data().name, res.data().tags));
        });
    }

    // Access progress of questions in firebase to display in view
    private getQuestionProgress(question: Question){
        const uid = this.authService.GetUID();
        if (uid !== '') {
            return this.firestore.collection('userModules').doc(uid).collection('questionProgress').doc(question.uid).get().toPromise()
                .then((res) => {
                    if (res.exists){
                        question.setProgress(res.data().progress);
                    }
                });
        }
    }

    // Stores progress of question in cloud firestore
    private setQuestionProgress(question: Question){
        const uid = this.authService.GetUID();
        if (uid !== '') {
            return this.firestore.collection('userModules').doc(uid).collection('questionProgress').doc(question.uid).set({
                progress: question.progress
            });
        }
    }

    // Increment progress of question after right answer
    async incrementQuestionProgress(question: Question){
        const uid = this.authService.GetUID();
        if (uid !== '') {
            question.incrementProgress();
            await this.setQuestionProgress(question);
            this.recalcModuleProgess();
        }
    }

    // Reset progress of question after wrong answer to 0
    async resetQuestionProgress(question: Question){
        const uid = this.authService.GetUID();
        if (uid !== '') {
            question.resetProgress();
            await this.setQuestionProgress(question);
            this.recalcModuleProgess();
        }
    }

    // Calculates module progress again after changes to question progress
    private recalcModuleProgess(){
        for (const module of this.userModules){
            module.calcProgress();
        }
    }

    searchModules(modules: Module[], query: string): Module[]{
        const filteredModules = [];
        const lowerCaseQuery = query.toLowerCase();
        for (const module of modules){
            if (module.name.toLowerCase().includes(lowerCaseQuery)){
                filteredModules.push(module);
            } else {
                const tags = module.tags.filter(tag => tag.includes(lowerCaseQuery));
                if (tags.length > 0){
                    filteredModules.push(module);
                }
            }
        }
        return filteredModules;
    }
    deleteLesson(currLesson) {
        console.log(currLesson);
    }
}

