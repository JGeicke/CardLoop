import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-logged-in',
    templateUrl: './logged-in.page.html',
    styleUrls: ['./logged-in.page.scss'],
})
export class LoggedInPage implements OnInit {

    recommendations: any[] = [];
    recommendation = {name: 'Compilerbau', cards: 42, tags: ['Programming', 'Computer Science', 'Something more']};
    sliderConfig = {
        spaceBetween: 10,
        slidesPerView: 1.4
    };

    constructor() {
        this.recommendations.push(this.recommendation);
        this.recommendations.push(this.recommendation);
        this.recommendations.push(this.recommendation);

    }

    ngOnInit() {
    }

    playLesson() {
        console.log('playlesson called');
    }

    lessonDetails() {
        console.log('lessondetails called');
    }

}
