import {Component, OnInit} from '@angular/core';
import {ModuleService} from '../../../services/module.service';
import {Module} from '../../../services/module.model';
import {Question} from '../../../services/question.model';
import {StatisticService} from '../../../services/statistic.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-learn-mode',
    templateUrl: './learn-mode.page.html',
    styleUrls: ['./learn-mode.page.scss'],
})
export class LearnModePage implements OnInit {

    private boxstyle: string;
    private rightanswer = null;
    private currModule: Module;
    private currModuleQuestions = [];
    private nextQuestion = 0;
    private question: Question = null;
    private maxQuestion: number;
    private confiremd = false;
    private multipleChoise = false;
    private selectedAnswers: boolean [] = [false, false, false, false, false, false, false];
    private rightAnswers: boolean[] = [false, false, false, false, false, false, false];
    private progress;
    private growth;

    constructor(private moduleService: ModuleService, private statistic: StatisticService, private router: Router) {
        this.initLearnMode();
        this.initNextQuestion();
    }

    ionViewWillEnter(){
        // used to restart the lesson
        if (this.progress >= 100){
            this.initLearnMode();
            this.initNextQuestion();
        }
    }

    initLearnMode(){
        // Reset & Init
        this.currModuleQuestions = [];
        this.nextQuestion = 0;
        this.progress = 0;

        this.boxstyle = 'answer-box';
        this.currModule = this.moduleService.currLesson;
        for (const question of this.currModule.questions){
            if (question.progress < 6){
                this.currModuleQuestions.push(question);
            }
        }
        this.maxQuestion = this.currModuleQuestions.length;
        this.question = this.currModuleQuestions[0];
        this.growth = 100 / this.currModuleQuestions.length;
        this.statistic.createNewSession();
    }

    ngOnInit() {
    }

    private changeProgress() {
        this.progress = this.growth * (this.nextQuestion + 1);
    }

    initNextQuestion() {
        if (this.nextQuestion !== this.maxQuestion) {
            this.changeProgress();
            this.selectedAnswers = [false, false, false, false, false, false, false];
            this.rightAnswers = [false, false, false, false, false, false, false];
            this.rightanswer = null;
            this.confiremd = false;
            this.question = this.currModuleQuestions[this.nextQuestion];
            for (const ans of this.question.solutions) {
                this.rightAnswers[ans] = true;
            }
            this.nextQuestion++;
            if (this.question.solutions.length > 1) {
                this.multipleChoise = true;
            } else {
                this.multipleChoise = false;
            }
        } else {
            this.router.navigate(['feedback']);
            console.log('last Question reached redirect to stats..');
        }
    }

    track(s: string): string {
        return s;
    }

    choose(index: number) {
        if (this.multipleChoise) {
            if (!this.confiremd) {
                if (this.selectedAnswers[index] !== true) {
                    this.selectedAnswers[index] = true;
                } else {
                    this.selectedAnswers[index] = false;
                }
            }
        } else {
            if (!this.confiremd) {
                this.selectedAnswers[index] = true;
                this.confirm();
            }
        }
    }

    getNextQuestion() {
        this.initNextQuestion();
    }

    gesLastQuestion() {
        if (this.nextQuestion === 0 || this.nextQuestion === 1) {
            this.nextQuestion = 0;
        } else {
            this.nextQuestion = this.nextQuestion - 2;
        }
        this.initNextQuestion();
    }

    confirm() {
        if (this.correctAnswers() && !this.confiremd){
            // selected answers were correct
            this.statistic.session.addCorrectlyAnsweredQuestion(this.question);
            this.moduleService.incrementQuestionProgress(this.question);
        } else if (!this.confiremd) {
            // selected answers were wrong
            this.statistic.session.addWronglyAnsweredQuestion(this.question);
            this.moduleService.resetQuestionProgress(this.question);
        }
        this.confiremd = true;
    }

    private correctAnswers(): boolean{
        let index = 0;
        for (const answer of this.selectedAnswers){
            if (answer !== this.rightAnswers[index]){
                return false;
            }
            index++;
        }
        return true;
    }

    randomQuestion() {
        // TODO: welche funktionalität ist gewünscht?
    }

    endSession() {
        // TODO: redirekt to stats screen
    }

}
