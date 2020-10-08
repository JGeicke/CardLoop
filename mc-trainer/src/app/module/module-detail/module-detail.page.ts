import {Component, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {ModuleService} from '../../../services/module.service';
import {Router} from '@angular/router';
import {AlertController, NavController, PopoverController, ViewWillEnter} from '@ionic/angular';
import {Module} from '../../../services/module.model';
import {PopoverPage} from '../../popover/popover.page';
import {AuthService} from '../../../services/auth.service';
import {QuestionStorageService} from "../add-modules/question-storage.service";

@Component({
    selector: 'app-module-detail',
    templateUrl: './module-detail.page.html',
    styleUrls: ['./module-detail.page.scss'],
})
export class ModuleDetailPage implements OnInit, ViewWillEnter {

    private picked = 'general';
    private currLessonJSON: any;
    private unsure: number;
    private halfway: number;
    private learned: number;

    constructor(private moduleService: ModuleService, private router: Router, private navCtrl: NavController,
                private popoverController: PopoverController, private auth: AuthService,
                private alertController: AlertController, private data: QuestionStorageService) {
    }

    ngOnInit() {
        // this.moduleService.currLesson = JSON.parse(localStorage.getItem('currLesson'));
        this.calcQuestionsProgress();
    }

    ionViewWillEnter() {
        // this.moduleService.currLesson = JSON.parse(localStorage.getItem('currLesson'));
        this.calcQuestionsProgress();
        console.log(this.moduleService.isModuleOwner(this.moduleService.currLesson));
    }

    /**
     *
     * @param $event by clicking on the question this popover is triggered to present
     * the user with further options to interact with the question
     * @param qix is the index of the question that is passed to the popover
     */
    async popover(ev: any, qix: number) {
        const popover = await this.popoverController.create({
            component: PopoverPage,
            cssClass: 'my-custom-class',
            event: ev,
            translucent: true,
            componentProps: {from: 'module-detail', qindex: qix}
        });
        return await popover.present();
    }

    /**
     *
     * @param $event that is triggered when the segement of the button switches sides
     */
    segmentChanged(ev: any) {
        console.log('Segment changed', ev);
    }

    /**
     * resets the progress for all Questions of the current Module
     */
    resetModuleProgress() {
        console.log('resetModuleProgress called');
        for (const question of this.moduleService.currLesson.questions) {
            this.moduleService.resetQuestionProgress(question).then(r => question);
        }
        this.calcQuestionsProgress();
    }

    /**
     * calculates the progress for all Questions and summs them up
     */
    calcQuestionsProgress() {
        this.unsure = 0;
        this.halfway = 0;
        this.learned = 0;
        for (const question of this.moduleService.currLesson.questions) {
            if (question.progress < 3) {
                this.unsure++;
            }
            if (question.progress > 2 && question.progress < 5) {
                this.halfway++;
            }
            if (question.progress > 4) {
                this.learned++;
            }
        }
    }

    /**
     * redirect to learn-mode to learn a module
     * @param module the module which will be learned
     */
    playLesson(module) {
        this.moduleService.currLesson = module;
        this.moduleService.recentlyPlayed = module;
        this.moduleService.saveRecentlyPlayed();
        this.router.navigate(['learn-mode']);
    }

    /**
     * redirect the view to the login page directly to the registration
     */
    redirectToRegister() {
        this.auth.registerTriggered = true;
        this.router.navigate(['login']);
    }

    /**
     * confirmation modal to delete module
     */
    async deleteModal() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Permanent deletion of module',
            message: 'Are u sure that u want to continue?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        alert.dismiss();
                    }
                }, {
                    text: 'Continue',
                    handler: () => {
                        this.moduleService.deleteModule(this.moduleService.currLesson);
                    }
                }
            ]
        });

        await alert.present();
    }

    /**
     * Prepares service to edit module and routes to add-modules
     */
    editModule(){
        // generate tags string
        let tagString = '';
        for (const t of this.moduleService.currLesson.tags){
            tagString += '#' + t + ' ';
        }

        this.data.module = {
            moduleUID: this.moduleService.currLesson.uid,
            moduleTitle: this.moduleService.currLesson.name,
            moduleTags: tagString,
            moduleDesc: this.moduleService.currLesson.description,
            moduleColor: this.moduleService.currLesson.color,
            questions: this.moduleService.currLesson.questions
        };
        this.router.navigate(['add-modules']);
    }
}
