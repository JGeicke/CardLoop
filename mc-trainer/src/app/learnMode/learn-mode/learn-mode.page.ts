import {Component, OnInit} from '@angular/core';
import {ModuleService} from '../../../services/module.service';
import {Module} from "../../../services/module.model";
import {Question} from "../../../services/question.model";

@Component({
    selector: 'app-learn-mode',
    templateUrl: './learn-mode.page.html',
    styleUrls: ['./learn-mode.page.scss'],
})
export class LearnModePage implements OnInit {

    private boxstyle: string;
    private selectedIndex = null;
    private rightanswer = null;
    private currModule: Module;
    private nextQuestion = 0;
    private question: Question = null;
    private maxQuestion: number;
    private confiremd: boolean = false;
    private multipleChoise: boolean = false;
    private selectedAnswers: boolean [] = [false, false, false, false, false, false, false];
    private rightAnswers: boolean[] = [false, false, false, false, false, false, false];
    private progress: number = 0;
    private growth: number = 0;

    constructor(private moduleService: ModuleService) {
        this.boxstyle = 'answer-box';
        this.currModule = moduleService.currLesson;
        this.maxQuestion = this.currModule.questions.length;
        console.log(this.currModule);
        this.question = this.currModule.questions[0];
        this.growth = 100 / this.currModule.questions.length;
        this.initNextQuestion();
    }

    ngOnInit() {
    }

    private changeProgress() {
        this.progress = this.growth * (this.nextQuestion+1);
    }

    initNextQuestion() {
        if (this.nextQuestion !== this.maxQuestion) {
            this.changeProgress();
            this.selectedAnswers = [false, false, false, false, false, false, false];
            this.rightAnswers = [false, false, false, false, false, false, false];
            this.rightanswer = null;
            this.confiremd = false;
            this.question = this.currModule.questions[this.nextQuestion];
            for (let ans of this.question.solutions) {
                this.rightAnswers[ans] = true;
            }
            this.nextQuestion++;
            if (this.question.solutions.length > 1) {
                this.multipleChoise = true;
            } else {
                this.multipleChoise = false;
            }
        } else {
            console.log('last Question reached redirect to stats..');
        }
    }

    track(string: string): string {
        return string;
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
        if (this.nextQuestion == 0 || this.nextQuestion == 1) {
            this.nextQuestion = 0;
        } else {
            this.nextQuestion = this.nextQuestion - 2;
        }
        this.initNextQuestion();
    }

    confirm() {
        console.log('answer No.' + this.selectedIndex + ' was selected');
        this.confiremd = true;
    }

    randomQuestion() {
        // TODO: welche funktionalität ist gewünscht?
    }

    endSession() {
        // TODO: redirekt to stats screen
    }

}
