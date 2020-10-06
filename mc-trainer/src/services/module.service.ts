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

    /**
     * all modules imported by the user
     */
    userModules: Module[] = [];
    /**
     * all modules stored in cloud firestore
     */
    allModules: Module[] = [];
    /**
     * last played module(lesson) of user
     */
    public recentlyPlayed: Module;
    /**
     * module(lesson) currently played by user
     */
    public currLesson: Module;
    public currQuestion = -1;
    /**
     * ensures getUserModules can only be run once at the same time
     */
    private runningGetUserModules: boolean = false;
    /**
     * ensures getAllModules can only be run once at the same time
     */
    private runningGetAllModules: boolean = false;

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
    getMostPlayedModules() {
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
    resetUserModuleData() {
        this.userModules = [];
        this.recentlyPlayed = null;
        this.currLesson = null;
    }

    /**
     * loads all Modules that the currently logged in User has already imported
     */
    async getUserModules() {

        if (!this.runningGetUserModules) {
            this.runningGetUserModules = true;
            let moduleIds = [];
            const uid = this.authService.GetUID();
            if (uid !== '') {
                await this.firestore.collection('userModules').doc(uid).get().toPromise().then((res) => {
                    moduleIds = res.data().modules;
                });
                this.userModules = [];
                for (const module of moduleIds) {
                    await this.getUserModule(module);
                }
                console.log(this.userModules);
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
                this.runningGetUserModules = false;
            }
        }

    }

    /**
     * loads all Modules that are currently stored in the Database
     */
    async getAllModules() {
        if (!this.runningGetAllModules) {
            this.runningGetAllModules = true;
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
            this.runningGetAllModules = false;
        }
    }

    /**
     * Increments playCount value of a module in firebase
     * @param module - played module
     */
    incrementModulePlayCount(module: Module) {
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
            module.questions = [];
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
            this.allModules.push(new Module(uid, res.data().description, res.data().name, res.data().tags,
                res.data().playCount, res.data().color, res.data().ownerUID));
        });
    }

    /**
     * Accesses module with uid in firebase & recreates it locally
     * @param uid the UID of the Module that will be loaded
     */
    private getUserModule(uid: string) {
        return this.firestore.collection('modules').doc(uid).get().toPromise().then((res) => {
            this.userModules.push(new Module(uid, res.data().description, res.data().name, res.data().tags,
                res.data().playCount, res.data().color, res.data().ownerUID));
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
     * @param module - module to check if imported
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
     * @param question - question to get progress from in firebase
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
     * @param question - question to set the progress from in firebase
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
     * @param question - question to set the progress from in firebase
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
     * Reset progress of a question after a wrong answer to 0 & recalcs the progress of the module containing it
     * @param question - question to reset the progress from in firebase
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
     * Reset progress of a module on button click in frontEnd
     * @param module is passed to the function to be reset
     */
    resetModuleProgress(module: Module) {
        const uid = this.authService.GetUID();
        if (uid !== '') {
            for (const question of module.questions) {
                this.resetQuestionProgress(question);
            }
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
     * @param module - module to delete
     */
    async deleteLesson(module: Module) {
        const uid = this.authService.GetUID();
        if (uid !== '') {
            const idx = this.userModules.indexOf(module);
            this.userModules.splice(idx, 1);
            const resultArray = [];
            this.userModules.forEach(m => resultArray.push(m.uid));
            await this.firestore.collection('userModules').doc(uid).set({
                modules: resultArray
            });

            // delete question progress
            for (const question of module.questions) {
                await this.firestore.collection('userModules').doc(uid).collection('questionProgress').doc(question.uid).delete();
            }
        }
    }

    /**
     * imports a Module into the Modules of the currently logged in User
     * @param module - module to import
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

    /**
     * Checks if current user is module owner
     * @param module - module to check the owner from
     * @return: boolean
     */
    isModuleOwner(module: Module): boolean {
        return module.ownerUID === this.authService.GetUID();
    }

    /**
     * Creates a new module in firestore, adds it locally to allModules & imports it
     * @param name - name of module
     * @param description - description of module
     * @param color - display color of module
     * @param tags - searchable tags of module
     * @param questions - question to add to new module
     */
    async createModule(name: string, description: string, color: string, tags: string[], questions: Question[]) {
        const userID = this.authService.GetUID();
        // check if any user is logged in
        if (userID !== '') {
            const res = await this.firestore.collection('modules').add({
                color,
                description,
                name,
                tags,
                playCount: 0,
                ownerID: userID
            });
            const moduleUID = res.id;
            // Add each questions as a document to the question collection of new module
            for (const question of questions) {
                const result = await this.addQuestionToModule(moduleUID, question);
                // Sets uid of local question to uid of added document in firebase
                question.uid = result.id;
            }
            // Create new local module
            const module = new Module(moduleUID, description, name, tags, 0, color, userID);
            // Add module to all modules
            this.allModules.push(module);
            this.importModule(module);
        }
    }

    /**
     * Adds question to module
     * @param moduleUID - module where the question will be added
     * @param question - question to add
     */
    addQuestionToModule(moduleUID: string, question: Question) {
        return this.firestore.collection('modules').doc(moduleUID).collection('questions').add({
            answers: question.answers,
            question: question.question,
            solutions: question.solutions
        });
    }

    /**
     * deletes module in firestore, updates allModules, updates userModules and recentlyPlayed
     * @param module - module to delete
     */
    async deleteModule(module: Module) {
        const userID = this.authService.GetUID();
        // check if any user is logged in
        if (userID !== '' && this.isModuleOwner(module)) {
            // delete every document of subcollection questions
            for (const question of module.questions) {
                await this.firestore.collection('modules').doc(module.uid).collection('questions').doc(question.uid).delete();
            }
            // delete document of module
            await this.firestore.collection('modules').doc(module.uid).delete();
            // update allModules
            this.getAllModules();
            // update local userModules
            this.deleteLesson(module);
            // update all modules of userModules collection
            this.updateUserModules(module);
            // update recently played
            await this.loadRecentlyPlayed();
        }
    }

    /**
     * Updates all documents of userModules collection that imported the now deleted module
     * removes the module from userModules, removes questionProgress of question from the module
     * and resets recentlyPlayed if the user recently played the deleted module
     * @param module - imported module that was deleted
     */
    private async updateUserModules(module: Module) {
        // get documents that contain the module id
        const result = await this.firestore.firestore.collection('userModules').where('modules', 'array-contains', module.uid).get();
        if (!result.empty) {
            let modules = [];
            // iterate the documents
            for (const doc of result.docs) {
                const recentlyPlayedModule = doc.data().recentlyPlayed;
                // check if recentlyPlayed uid matches deleted module uid
                if (recentlyPlayedModule === module.uid) {
                    // reset if match
                    await this.firestore.collection('userModules').doc(doc.id).update({
                        recentlyPlayed: ''
                    });
                }
                // get all modules of current document
                modules = doc.data().modules;
                // check if modules contain deleted module uid
                const idx = modules.indexOf(module.uid);
                // user imported the module - delete possible question progress
                if (idx !== -1) {
                    for (const question of module.questions) {
                        await this.firestore.collection('userModules').doc(doc.id).collection('questionProgress')
                            .doc(question.uid).delete();
                    }
                }
                // remove deleted module uid & store in firebase
                modules.splice(idx, 1);
                await this.firestore.collection('userModules').doc(doc.id).update({
                    modules
                });
            }
        }
    }

    /**
     * Edit an existing module in firebase & change the local userModule accordingly.
     * !When adding a new question, it is important to initialize the uid of the question with '-1'.!
     * The local uid is getting replaced by the generated firestore uid after adding the question to the questions-collection of the module.
     * @param module - module to be edited
     * @param name - name of module
     * @param description - description of module
     * @param color - displayed color of module
     * @param tags - searchable tags of module
     * @param questions - questions of module
     */
    async editModule(module: Module, name: string, description: string, color: string, tags: string[], questions: Question[]) {
        // edit module in firebase
        this.firestore.collection('modules').doc(module.uid).update({
            name,
            description,
            color,
            tags
        });
        // edit questions of module in firebase
        for (const question of questions) {
            // check if question already got id
            if (question.uid !== '-1') {
                this.firestore.collection('modules').doc(module.uid).collection('questions').doc(question.uid).update({
                    answers: question.answers,
                    question: question.question,
                    solutions: question.solutions
                });
            } else {
                // newly created question & set generated id
                const res = await this.addQuestionToModule(module.uid, question);
                question.uid = res.id;
            }
        }
        // edit module locally in userModule
        module.name = name;
        module.description = description;
        module.color = color;
        module.tags = tags;
        module.questions = questions;

        // update all modules
        await this.getAllModules();
    }
}

