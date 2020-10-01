import {Component, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {ModuleService} from "../../../services/module.service";
import {Router} from "@angular/router";
import {NavController, ViewWillEnter} from "@ionic/angular";

@Component({
    selector: 'app-module-detail',
    templateUrl: './module-detail.page.html',
    styleUrls: ['./module-detail.page.scss'],
})
export class ModuleDetailPage implements OnInit, ViewWillEnter {

    private picked = 'general';
    questions_arr = [1, 2, 3, 4, 5, 6];
    private currLessonJSON: any;
    private unsure: number;
    private halfway: number;
    private learned: number;

    constructor(private moduleService: ModuleService, private router: Router, private navCtrl: NavController) {
    }

    ngOnInit() {
        // this.moduleService.currLesson = JSON.parse(localStorage.getItem('currLesson'));
        this.calcQuestionsProgress();
    }

    ionViewWillEnter() {
        // this.moduleService.currLesson = JSON.parse(localStorage.getItem('currLesson'));
        this.calcQuestionsProgress();
    }

    /**
     * TODO
     * @param $event
     */
    segmentChanged($event: any) {
        console.log('segment changed triggered');
    }

    /**
     * resets the progress for all Questions of the current Module
     */
    resetModuleProgress() {
        console.log('resetModuleProgress called')
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
        console.log('calcquestionprogress is called');
        for (const question of this.moduleService.currLesson.questions) {
            console.log('questionsprogress is: ' + question.progress);
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
        this.moduleService.saveRecentlyPlayed();
        this.router.navigate(['learn-mode']);
    }
}
