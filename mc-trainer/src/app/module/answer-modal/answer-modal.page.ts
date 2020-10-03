import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-answer-modal',
  templateUrl: './answer-modal.page.html',
  styleUrls: ['./answer-modal.page.scss'],
})
export class AnswerModalPage implements OnInit {

  solutions: boolean[] = [false, false, false, false, false, false];
  question = 'Enter your question here';
  answer = 'Enter your answer here';
  first = 'first answer';
  second = 'second answer';
  third = 'third answer';
  fourth = 'fourth answer';
  fifth = 'fifth answer';
  last = 'last answer';
  answers: string[] = [];

  constructor() { }

  ngOnInit() {

  }

  addAnswer() {
    this.answers.push('Enter your answer here');
  }

  showAnswers_arr() {
    console.log(this.answers);
  }

  showSolutions_arr() {
    console.log(this.solutions);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  save() {
    console.log('save changes called');
  }

}
