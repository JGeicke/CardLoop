import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Question} from '../../../services/question.model';
import {QuestionStorageService} from '../add-modules/question-storage.service';

@Component({
  selector: 'app-answer-modal',
  templateUrl: './answer-modal.page.html',
  styleUrls: ['./answer-modal.page.scss'],
})
export class AnswerModalPage implements OnInit {

  private questionObj: Question;
  solutions: boolean[] = [false, false, false, false, false, false];
  question = '';
  answer = 'Enter your answer here';
  first = 'first answer';
  second = 'second answer';
  third = 'third answer';
  fourth = 'fourth answer';
  fifth = 'fifth answer';
  last = 'last answer';
  answers: string[] = [];

  // edit question
  questionUID: string;

  placeholderAnswers = ['Enter your answer here', 'Enter your answer here', 'Enter your answer here', 'Enter your answer here'];
  placeholderQuestion = 'Enter your question here';

  // warning toggle
  hasWarning: boolean;
  warningText: string;

  constructor(private route: ActivatedRoute, private router: Router, private data: QuestionStorageService) {
    // add 4 answers
    this.answers.push('');
    this.answers.push('');
    this.answers.push('');
    this.answers.push('');
  }

  ionViewWillEnter(){
    // Reset warning
    this.hasWarning = false;
    this.warningText = '';
    // Reset user inputs
    this.question = '';
    this.answers = ['', '', '', ''];
    this.solutions = [false, false, false, false, false, false];
    this.questionUID = null;
    if (this.data.storage !== null){
      this.question = this.data.storage.question;
      this.answers = this.data.storage.answers;
      this.questionUID = this.data.storage.questionUID;
      const sol = this.data.storage.solutions;
      for (const s of sol) {
        this.solutions[s] = true;
      }
    }
  }

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
    const sols = [];
    for (let i = 0; i < this.solutions.length; i++){
      if (this.solutions[i]){
        sols.push(i);
      }
    }
    this.checkForWarnings(sols);
    // no warnings found
    if (!this.hasWarning) {
      if (this.questionUID === null) {
        this.data.storage = {
          question: this.question,
          answers: this.answers,
          solutions: sols
        };
      } else {
        this.data.storage = {
          questionUID: this.questionUID,
          question: this.question,
          answers: this.answers,
          solutions: sols
        };
      }
      this.router.navigate(['add-modules', {picked: 'questions'}]);
    }
  }

  private checkForWarnings(solutions: number[]){
    // question needs atleast 4 answers
    if (this.answers.length < 4){
      this.hasWarning = true;
      this.warningText = 'A Question needs 4-6 answers!';
    } else if (solutions.length < 1) {
      this.hasWarning = true;
      this.warningText = 'A Questions needs atleast 1 correct answer!';
    } else {
      // check for empty answers
      for (const answer of this.answers){
        if (answer.length === 0){
          this.hasWarning = true;
          this.warningText = 'Please fill out all required input-fields!';
          return;
        }
      }
      // check for empty question
      if (this.question.length === 0){
        this.hasWarning = true;
        this.warningText = 'Please fill out all required input-fields!';
        return;
      }
      this.hasWarning = false;
    }
  }

}
