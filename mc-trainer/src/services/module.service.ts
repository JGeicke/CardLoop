import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from '@angular/fire/firestore';
import {Module} from './module.model';
import {AlertController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {filter, map} from 'rxjs/operators';
import {Question} from './question.model';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ModuleService {

    userModules: Module[] = [];
    allModules: Module[] = [];
    public recentlyPlayed: Module;
    public currLesson: Module;

    constructor(private firestore: AngularFirestore,
                private authService: AuthService,
                private alertController: AlertController,
                private router: Router) {
        this.getAllModules();
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
    async getUserModules() {
        this.userModules = [];
        let moduleIds = [];
        const uid = this.authService.GetUID();
        if (uid !== '') {
            await this.firestore.collection('userModules').doc(uid).get().toPromise().then((res) => {
                moduleIds = res.data().modules;
            });
            for (const module of moduleIds){
                await this.getUserModule(module);
            }
            for (const module of this.userModules){
                await this.getModuleQuestions(module);
                for (const question of module.questions){
                    await this.getQuestionProgress(question);
                }
                module.calcProgress();
            }
            return this.loadRecentlyPlayed();
        }

    }

    // loads all Modules that are currently stored in the Database
    async getAllModules() {
        const moduleIds = [];
        this.allModules = [];
        await this.firestore.collection('modules').get().toPromise().then((res) => {
            res.forEach(a => {
                moduleIds.push(a.id);
            });
        });
        for (const uid of moduleIds){
            await this.getModule(uid);
        }
        for (const module of this.allModules){
            await this.getModuleQuestions(module);
            console.log(module);
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


    private getModule(uid: string) {
        return this.firestore.collection('modules').doc(uid).get().toPromise().then((res) => {
            this.allModules.push(new Module(uid, res.data().description, res.data().name, res.data().tags));
        });
    }

    // Accesses module with uid in firebase & recreates it locally
    private getUserModule(uid: string) {
        return this.firestore.collection('modules').doc(uid).get().toPromise().then((res) => {
            this.userModules.push(new Module(uid, res.data().description, res.data().name, res.data().tags));
        });
    }

    getModuleDetails(module: Module) {
        this.currLesson = module;
        localStorage.setItem('currLesson', JSON.stringify(this.currLesson));
        this.router.navigate(['module-detail']);
    }


    searchModules(modules: Module[], query: string): Module[]{
        const filteredModules = [];
        const lowerCaseQuery = query.toLowerCase();
        for (const module of modules){
            if (module.name.toLowerCase().includes(lowerCaseQuery)){
                filteredModules.push(module);
            } else {
                const tags = module.tags.filter(tag => tag.toLowerCase().includes(lowerCaseQuery));
                if (tags.length > 0){
                    filteredModules.push(module);
                }
            }
        }
        return filteredModules;
    }

    // checks if the given module is already imported by the user that is logged in
        isModuleImported(module: Module): boolean{
            for (const m of this.userModules) {
                if (m.uid === module.uid) {
                    return true;
                }
            }
            return false;
        }

    // Access progress of questions in firebase to display in view
    getQuestionProgress(question: Question){
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

    // Save recently played lesson in firebase
    saveRecentlyPlayed(){
        const uid = this.authService.GetUID();
        if (uid !== '') {
            this.firestore.collection('userModules').doc(uid).update({
                recentlyPlayed: this.currLesson.uid
            });
        }
    }

    loadRecentlyPlayed(){
        const uid = this.authService.GetUID();
        if (uid !== '') {
            return this.firestore.collection('userModules').doc(uid).get().toPromise()
                .then((res) => {
                    if (res.exists){
                        const id = res.data().recentlyPlayed;
                        for (const module of this.userModules){
                            console.log('Recently played check:' + module.name);
                            if (module.uid === id){
                                this.recentlyPlayed = module;
                                break;
                            }
                        }
                        if (this.recentlyPlayed === undefined){
                           this.recentlyPlayed = this.allModules[Math.floor(Math.random() * this.allModules.length)];
                        }
                    }
                });
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

    // Deletes module of user
    async deleteLesson(currLesson: Module) {
        const uid = this.authService.GetUID();
        if (uid !== '') {
            const idx = this.userModules.indexOf(currLesson);
            this.userModules.splice(idx, 1);
            const resultArray = [];
            this.userModules.forEach(module => resultArray.push(module.uid));
            await this.firestore.collection('userModules').doc(uid).set({
               modules: resultArray
            });
        }
    }

    importModule(module: Module){
        const userID = this.authService.GetUID();
        // check if any user is logged in
        if (userID !== ''){
            const uModuleIDs = [];
            for (const m of this.userModules){
                uModuleIDs.push(m.uid);
            }
            uModuleIDs.push(module.uid);
            this.firestore.collection('userModules').doc(userID).update({modules: uModuleIDs}).then(() => {
                this.getUserModules();
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

