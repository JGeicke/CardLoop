import {Component, Input, OnInit} from '@angular/core';
import { ModuleService } from '../../services/module.service';
import {Module} from '../../services/module.model';
import {NavParams, PopoverController} from '@ionic/angular';
import {Router} from '@angular/router';
import {QuestionStorageService} from '../module/add-modules/question-storage.service';
@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {
// @Input("from") from;
  private calledfrom;

  constructor(private moduleService: ModuleService,
              public popoverController: PopoverController,
              public navParams: NavParams,
              private router: Router,
              private data: QuestionStorageService) { }

  ngOnInit() {
    this.calledfrom = this.navParams.get('from');
  }

  async getModuleDetails() {
    await this.popoverController.dismiss();
    this.moduleService.getModuleDetails(this.moduleService.currLesson);
  }

  async startDelete() {
    await this.popoverController.dismiss();
    await this.moduleService.delDialog();
  }

  async startEdit(){
    await this.popoverController.dismiss();
    // generate tags string
    let tag = '';
    for (const t of this.moduleService.currLesson.tags){
      tag += '#' + t + ' ';
    }
    this.data.module = {
      moduleUID: this.moduleService.currLesson.uid,
      moduleTitle: this.moduleService.currLesson.name,
      moduleTags: tag,
      moduleDesc: this.moduleService.currLesson.description,
      moduleColor: this.moduleService.currLesson.color,
      questions: this.moduleService.currLesson.questions
    };
    this.router.navigate(['add-modules']);
  }

  async getQuestionDetails() {
    await this.popoverController.dismiss();
    this.moduleService.currQuestion = this.navParams.get('qindex');
    await this.router.navigate(['learn-mode']);
  }

  async startTestWith() {
  }

}
