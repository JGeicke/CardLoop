import {Component, OnInit} from '@angular/core';
import {ModuleService} from '../../../services/module.service';

@Component({
    selector: 'app-learn-mode',
    templateUrl: './learn-mode.page.html',
    styleUrls: ['./learn-mode.page.scss'],
})
export class LearnModePage implements OnInit {

    private boxstyle: string;
    private selectedIndex = null;
    private rightanswer = null;

    constructor(private moduleService: ModuleService) {
        this.boxstyle = 'answer-box';
    }

    ngOnInit() {
    }

    choose(index: number) {
        if (this.selectedIndex !== index) {
            this.selectedIndex = index;
        } else {
            this.selectedIndex = null;
        }
    }

    confirm() {
        console.log('answer No.' + this.selectedIndex + ' was selected');
        this.rightanswer = this.moduleService.currLesson.questions[0].solutions[0];
    }

}
