import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Module} from './module.model';
import {AlertController} from '@ionic/angular';
import {AuthService} from './auth.service';
import {Question} from './question.model';
import {Router} from '@angular/router';
import {StatisticService} from './statistic.service';
import * as firebase from 'firebase/app';
import {AchievementService} from './achievement.service';

@Injectable({
    providedIn: 'root'
})
export class ModuleService {

    userModules: Module[] = [];
    allModules: Module[] = [];
    public recentlyPlayed: Module;
    public currLesson: Module;
    public currQuestion = -1;

    constructor(private firestore: AngularFirestore,
                private authService: AuthService,
                private alertController: AlertController,
                private router: Router,
                private statisticService: StatisticService,
                private achievementService: AchievementService) {
        this.getAllModules();
    }


    /**
     * shows the confirmation dialog of the Module deletion
     */
    async delDialog() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Please confirm!',
            message: '<p>This item and all associated ' +
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

    /**
     * loads all Modules that the currently logged in User has already imported
     */
    /**
     * Sorts allModules-array by globalPlayCount and returns sorted array
     */
    getMostPlayedModules(){
        return this.allModules.sort((a, b) => {

            if (a.globalPlayCount > b.globalPlayCount) {
                return -1;
            }

            if (a.globalPlayCount < b.globalPlayCount) {
                return 1;
            }
            return 0;
        });
    }

    /**
     * Resets user modules, recentlyPlayed and currLesson - needed for log-out
     */
    resetUserModuleData(){
        this.userModules = [];
        this.recentlyPlayed = null;
        this.currLesson = null;
    }

    /**
     * loads all Modules that the currently logged in User has already imported
     */
    async getUserModules() {
        this.userModules = [];
        let moduleIds = [];
        const uid = this.authService.GetUID();
        if (uid !== '') {
            await this.firestore.collection('userModules').doc(uid).get().toPromise().then((res) => {
                moduleIds = res.data().modules;
            });
            for (const module of moduleIds) {
                await this.getUserModule(module);
            }
            for (const module of this.userModules) {
                await this.getModuleQuestions(module);
                for (const question of module.questions) {
                    await this.getQuestionProgress(question);
                }
                module.calcProgress();
            }
            await this.statisticService.getUserStats(uid);
            this.achievementService.generateAchievements(this.userModules.length);
            return this.loadRecentlyPlayed();
        }

    }

    /**
     * loads all Modules that are currently stored in the Database
     */
    async getAllModules() {
        const moduleIds = [];
        this.allModules = [];
        await this.firestore.collection('modules').get().toPromise().then((res) => {
            res.forEach(a => {
                moduleIds.push(a.id);
            });
        });
        for (const uid of moduleIds) {
            await this.getModule(uid);
        }
        for (const module of this.allModules) {
            await this.getModuleQuestions(module);
            console.log(module);
        }
    }

    /**
     * Increments playCount value of a module in firebase
     * @param module - played module
     */
    incrementModulePlayCount(module: Module){
       firebase.firestore().collection('modules').doc(module.uid).update({
          playCount: firebase.firestore.FieldValue.increment(1)
       });
    }

    /**
     * Accesses questions of module in firebase & recreates it locally
     * @param module the Module of which the questions will be loaded
     */
    private getModuleQuestions(module: Module) {
        return this.firestore.collection('modules').doc(module.uid).collection('questions').get().toPromise().then((res) => {
            res.forEach(doc => {
                const data = doc.data();
                module.questions.push(new Question(doc.id, data.question, data.answers, data.solutions));
            });
        });
    }


    /**
     * loads a Module form the FireBase storage
     * @param uid the UID of the Module that will be loaded
     */
    private getModule(uid: string) {
        return this.firestore.collection('modules').doc(uid).get().toPromise().then((res) => {
            this.allModules.push(new Module(uid, res.data().description, res.data().name, res.data().tags, res.data().playCount));
        });
    }

    /**
     * Accesses module with uid in firebase & recreates it locally
     * @param uid the UID of the Module that will be loaded
     */
    private getUserModule(uid: string) {
        return this.firestore.collection('modules').doc(uid).get().toPromise().then((res) => {
            this.userModules.push(new Module(uid, res.data().description, res.data().name, res.data().tags, res.data().playCount));
        });
    }

    /**
     * sets the current lesson and saves it in the localStorage then redirect to module-detail
     * @param module  the Module in question
     */
    getModuleDetails(module: Module) {
        this.currLesson = module;
        localStorage.setItem('currLesson', JSON.stringify(this.currLesson));
        this.router.navigate(['module-detail']);
    }


    /**
     * filters the given Array of Modules with the given query
     * @param modules the Modules which will be filtered
     * @param query the filter query
     */
    searchModules(modules: Module[], query: string): Module[] {
        const filteredModules = [];
        const lowerCaseQuery = query.toLowerCase();
        for (const module of modules) {
            if (module.name.toLowerCase().includes(lowerCaseQuery)) {
                filteredModules.push(module);
            } else {
                const tags = module.tags.filter(tag => tag.toLowerCase().includes(lowerCaseQuery));
                if (tags.length > 0) {
                    filteredModules.push(module);
                }
            }
        }
        return filteredModules;
    }

    /**
     * checks if the given module is already imported by the user that is logged in
     * @param module
     */
    isModuleImported(module: Module): boolean {
        for (const m of this.userModules) {
            if (m.uid === module.uid) {
                return true;
            }
        }
        return false;
    }

    /**
     * Access progress of questions in firebase to display in view
     * @param question
     */
    getQuestionProgress(question: Question) {
        const uid = this.authService.GetUID();
        if (uid !== '') {
            return this.firestore.collection('userModules').doc(uid).collection('questionProgress').doc(question.uid).get().toPromise()
                .then((res) => {
                    if (res.exists) {
                        question.setProgress(res.data().progress);
                    }
                });
        }
    }

    /**
     * Stores progress of question in cloud firestore
     * @param question
     */
    private setQuestionProgress(question: Question) {
        const uid = this.authService.GetUID();
        if (uid !== '') {
            return this.firestore.collection('userModules').doc(uid).collection('questionProgress').doc(question.uid).set({
                progress: question.progress
            });
        }
    }

    /**
     * Increment progress of question after right answer
     * @param question
     */
    async incrementQuestionProgress(question: Question) {
        const uid = this.authService.GetUID();
        if (uid !== '') {
            question.incrementProgress();
            await this.setQuestionProgress(question);
            this.recalcModuleProgess();
        }
    }

    /**
     * Save recently played lesson in firebase
     */
    saveRecentlyPlayed() {
        const uid = this.authService.GetUID();
        if (uid !== '') {
            this.firestore.collection('userModules').doc(uid).update({
                recentlyPlayed: this.currLesson.uid
            });
        }
    }

    /**
     * loads the most recetly played module into this.recentlyPlayed
     */
    loadRecentlyPlayed() {
        const uid = this.authService.GetUID();
        if (uid !== '') {
            return this.firestore.collection('userModules').doc(uid).get().toPromise()
                .then((res) => {
                    if (res.exists) {
                        const id = res.data().recentlyPlayed;
                        for (const module of this.userModules) {
                            console.log('Recently played check:' + module.name);
                            if (module.uid === id) {
                                this.recentlyPlayed = module;
                                break;
                            }
                        }
                        if (this.recentlyPlayed === undefined) {
                            this.recentlyPlayed = this.allModules[Math.floor(Math.random() * this.allModules.length)];
                        }
                    }
                });
        }
    }

    /**
     * Reset progress of a question after a wrong answer to 0
     * @param question
     */
    async resetQuestionProgress(question: Question) {
        const uid = this.authService.GetUID();
        if (uid !== '') {
            question.resetProgress();
            await this.setQuestionProgress(question);
            this.recalcModuleProgess();
        }
    }

    /**
     * Calculates module progress again after changes to question progress
     */
    private recalcModuleProgess() {
        for (const module of this.userModules) {
            module.calcProgress();
        }
    }

    /**
     * Deletes module of user
     * @param module
     */
    async deleteLesson(module: Module) {
        const uid = this.authService.GetUID();
        if (uid !== '') {
            const idx = this.userModules.indexOf(module);
            this.userModules.splice(idx, 1);
            const resultArray = [];
            this.userModules.forEach(module => resultArray.push(module.uid));
            await this.firestore.collection('userModules').doc(uid).set({
                modules: resultArray
            });
        }
    }

    /**
     * imports a Module into the Modules of the currently logged in User
     * @param module
     */
    importModule(module: Module) {
        const userID = this.authService.GetUID();
        // check if any user is logged in
        if (userID !== '') {
            const uModuleIDs = [];
            for (const m of this.userModules) {
                uModuleIDs.push(m.uid);
            }
            uModuleIDs.push(module.uid);
            this.firestore.collection('userModules').doc(userID).update({modules: uModuleIDs}).then(() => {
                this.getUserModules();
            });
        } else {
            // if noone is logged in
            // show promt to let a user log on register
            this.importLoginConflicktModal();
        }
    }

    /**
     * shows promt to redirect to the login page or cancel the action
     */
    async importLoginConflicktModal() {
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

