import { Component, OnInit } from '@angular/core';
import {ModuleService} from "../../../services/module.service";
import {Question} from "../../../services/question.model";

@Component({
  selector: 'app-add-modules',
  templateUrl: './add-modules.page.html',
  styleUrls: ['./add-modules.page.scss'],
})
export class AddModulesPage implements OnInit {

  // module variables
  private picked = 'questions';
  private moduleTitle = 'Your Title';
  private moduleTags = '#yourtag';
  private moduleDesc = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr,' +
      ' sed diam nonumy eirmod tempor invidunt ut labore.';
  private moduleColor = '#cf5d5d';
  private color_arr= ['#BA6363', '#97BF78', '#8D779D', '#C29157', '#D1B963', '#466078', '#428F81', '#BB769B'];

  // quesiton variables
  private quest_arr: Question[] = [];
  private question = 'Was ist die Hauptstadt von Kamerun?';
  private answer = ['Jaunde', 'Maunde', 'Kalaunde', 'Schmaunde', 'Banaunde'];
  private solutions = [1];

  constructor(private moduleService: ModuleService) {
    this.quest_arr.push(new Question('1', 'Was ist die Hauptstadt von Kamerun?', this.answer, this.solutions));
    this.quest_arr.push(new Question('1', 'Was ist die Hauptstadt von Kamerun?', this.answer, this.solutions));
    this.quest_arr.push(new Question('1', 'Was ist die Hauptstadt von Kamerun?', this.answer, this.solutions));
  }

  ngOnInit() {

  }

  submit() {
    console.log('submit called');
  }

  /**
   *
   * @param $event that is triggered when the segement of the button switches sides
   */
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

}
