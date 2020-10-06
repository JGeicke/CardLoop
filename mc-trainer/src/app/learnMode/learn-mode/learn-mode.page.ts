import {Component, OnInit} from '@angular/core';
import {ModuleService} from '../../../services/module.service';
import {Module} from '../../../services/module.model';
import {Question} from '../../../services/question.model';
import {StatisticService} from '../../../services/statistic.service';
import {Router} from '@angular/router';
import {NavController} from '@ionic/angular';

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
    private chosenAnswer: number;
    private answered = false;
    private progress;
    private growth;

    constructor(private moduleService: ModuleService, private statistic: StatisticService,
                private router: Router, private navCtrl: NavController) {
        this.initLearnMode();
        this.initNextQuestion();
    }

    ionViewWillEnter() {
        // used to restart the lesson
        if (this.progress >= 100) {
            this.initLearnMode();
            this.initNextQuestion();
        }
    }

    /**
     * inital reset of all fields and loads the needed Data from the Services
     */
    initLearnMode() {
        this.currModuleQuestions = [];
        this.nextQuestion = 0;
        this.progress = 0;

        this.boxstyle = 'answer-box';
        this.moduleService.incrementModulePlayCount(this.moduleService.currLesson);
        this.currModule = this.moduleService.currLesson;
        for (const question of this.currModule.questions) {
            if (question.progress < 6) {
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

    /**
     * adds the progress of 1 answered question to the progress bar
     */
    private changeProgress() {
        this.progress = this.growth * (this.nextQuestion);
    }

    /**
     *  loads the next Question or redirects to the feedback view if last Question was reached
     */
    initNextQuestion() {
        if (this.nextQuestion !== this.maxQuestion) {
            this.answered = false;
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
            // calculate progress again
            this.moduleService.currLesson.calcProgress();
            this.endSession();
            console.log('last Question reached redirect to stats..');
        }
    }

    /**
     * checks if the current question has changed and loads the new Question and Answers into the view
     *
     * @param s if changed from previous -> will trigger reload
     */
    track(s: string): string {
        return s;
    }

    /**
     * selects the given Answer index if the Question isnt confirmed yet
     *
     * @param index the selected Answer
     */
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

    /**
     * loads the next question
     */
    getNextQuestion() {
        this.initNextQuestion();
    }

    /**
     * loads the last question again
     */
    gesLastQuestion() {
        if (this.nextQuestion === 0 || this.nextQuestion === 1) {
            this.nextQuestion = 0;
        } else {
            this.nextQuestion = this.nextQuestion - 2;
        }
        this.initNextQuestion();
    }

    /**
     * confirms the selected answers for the current question
     */
    confirm() {
        this.answered = !this.answered;
        if (this.correctAnswers() && !this.confiremd) {
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

    /**
     * checks if only the right answers were selected
     */
    private correctAnswers(): boolean {
        let index = 0;
        for (const answer of this.selectedAnswers) {
            if (answer !== this.rightAnswers[index]) {
                return false;
            }
            index++;
        }
        return true;
    }

    /**
     * randomises the order of the questions
     */
    randomQuestion() {
        console.log('TODO');
        // TODO: welche funktionalität ist gewünscht?
    }

    /**
     * redirects to the feedback view
     */
    endSession() {
        this.router.navigate(['feedback']);
    }

}
