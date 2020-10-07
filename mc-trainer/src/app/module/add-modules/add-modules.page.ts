import { Component, OnInit } from '@angular/core';
import {ModuleService} from '../../../services/module.service';
import {Question} from '../../../services/question.model';
import {ActivatedRoute, Router} from '@angular/router';
import {QuestionStorageService} from './question-storage.service';
import {ViewWillEnter} from "@ionic/angular";

@Component({
  selector: 'app-add-modules',
  templateUrl: './add-modules.page.html',
  styleUrls: ['./add-modules.page.scss'],
})
export class AddModulesPage implements OnInit, ViewWillEnter {

  // module variables
  private picked = 'questions';
  private moduleTitle: string;
  private moduleTags: string;
  private moduleDesc: string;
  private moduleColor: string;
  private colorArr = ['#BA6363', '#97BF78', '#8D779D', '#C29157', '#D1B963', '#466078', '#428F81', '#BB769B'];

  private moduleUID: string;
  private isEdit: boolean;

  // question variables
  private questArr: Question[] = [];
  private solutions = [1];

  // placeholder variables
  private placeholderModuleTitle = 'Your Title';
  private placeholderModuleTags = '#yourtag';
  private placeholderModuleDesc = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr,' +
      ' sed diam nonumy eirmod tempor invidunt ut labore.';

  // warning variables
  hasWarning: boolean;
  warningText: string;

  constructor(private moduleService: ModuleService, private router: Router,
              private route: ActivatedRoute, private data: QuestionStorageService) {
  }

  ngOnInit() {

  }

  ionViewWillEnter(){
    // Reset warning
    this.hasWarning = false;
    this.warningText = '';
    // reset input
    this.moduleTitle = '';
    this.moduleTags = '';
    this.moduleDesc = '';
    this.moduleColor = '#BA6363';
    this.questArr = [Question.localQuestion('a', [], [])];
    // check which view should be displayed
    const paramMap = this.route.snapshot.paramMap;
    const pickedParam = paramMap.get('picked');
    if (pickedParam !== null){
      this.picked = pickedParam;
    }
    // check if module is in storage
    if (this.data.module !== null){
      this.moduleTitle = this.data.module.moduleTitle;
      this.moduleTags = this.data.module.moduleTags;
      this.moduleDesc = this.data.module.moduleDesc;
      this.moduleColor = this.data.module.moduleColor;
      this.questArr = this.data.module.questions;
      if (this.data.module.moduleUID !== null){
        this.moduleUID = this.data.module.moduleUID;
        this.isEdit = true;
      }
      console.log('isEdit ' + this.isEdit);
      this.data.resetModule();
    }
    // check if user created question in storage
    if (this.data.storage !== null){
      if (this.data.storage.questionUID === null){
        this.questArr.push(Question.localQuestion(this.data.storage.question, this.data.storage.answers, this.data.storage.solutions));
      } else {
        const uid = this.data.storage.questionUID;
        for (const question of this.questArr){
          if (question.uid === uid){
            question.question = this.data.storage.question;
            question.answers = this.data.storage.answers;
            question.solutions = this.data.storage.solutions;
            console.log(question);
            break;
          }
        }
      }
      this.data.resetStorage();
    }
  }

  /**
   * Save current user input in storage & route to answerModal-page
   */
  createQuestion(){
    if (this.isEdit){
      this.data.module = {
        moduleUID: this.moduleUID,
        moduleTitle: this.moduleTitle,
        moduleTags: this.moduleTags,
        moduleDesc: this.moduleDesc,
        moduleColor: this.moduleColor,
        questions: this.questArr
      };
    } else {
      this.data.module = {
        moduleTitle: this.moduleTitle,
        moduleTags: this.moduleTags,
        moduleDesc: this.moduleDesc,
        moduleColor: this.moduleColor,
        questions: this.questArr
      };
    }
    this.router.navigate(['answer-modal']);
  }

  editQuestion(question: Question){
    if (this.isEdit){
      this.data.module = {
        moduleUID: this.moduleUID,
        moduleTitle: this.moduleTitle,
        moduleTags: this.moduleTags,
        moduleDesc: this.moduleDesc,
        moduleColor: this.moduleColor,
        questions: this.questArr
      };
    } else {
      this.data.module = {
        moduleTitle: this.moduleTitle,
        moduleTags: this.moduleTags,
        moduleDesc: this.moduleDesc,
        moduleColor: this.moduleColor,
        questions: this.questArr
      };
    }
    this.data.storage = {
      questionUID: question.uid,
      question: question.question,
      answers: question.answers,
      solutions: question.solutions
    };
    this.router.navigate(['answer-modal']);
  }

  submit() {
    this.checkForWarnings();
    if (!this.hasWarning) {
      if (this.isEdit){
        this.editModule();
      } else {
        this.generateModule();
      }
      this.data.resetModule();
      this.router.navigate(['module-list']);
    }
  }

  /**
   * Generates tag array and calls createModule-function of moduleService
   */
  private generateModule(){
    let tags;
    if (this.moduleTags.startsWith('#')){
      this.moduleTags = this.moduleTags.substring(1);
    }
    tags = this.moduleTags.replace(' ', '').split('#');
    this.moduleService.createModule(this.moduleTitle, this.moduleDesc, this.moduleColor, tags, this.questArr);
  }

  private editModule(){
    let tags;
    if (this.moduleTags.startsWith('#')){
      this.moduleTags = this.moduleTags.substring(1);
    }
    tags = this.moduleTags.replace(' ', '').split('#');
    this.moduleService.editModule(this.moduleService.currLesson, this.moduleTitle, this.moduleDesc, this.moduleColor, tags, this.questArr);
  }

  /**
   *
   * @param $event that is triggered when the segement of the button switches sides
   */
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  private checkForWarnings(){
    // module needs atleast 1 question
    if (this.questArr.length < 1){
      this.hasWarning = true;
      this.warningText = 'Please create atleast 1 question';
      // check if input is empty
    } else if (this.moduleTitle.length === 0 || this.moduleTags.length === 0 || this.moduleDesc.length === 0){
      this.hasWarning = true;
      this.warningText = 'Please fill out all required input-fields!';
    } else {
      this.hasWarning = false;
    }
  }

}
