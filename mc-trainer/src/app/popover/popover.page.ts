import {Component, Input, OnInit} from '@angular/core';
import { ModuleService } from '../../services/module.service';
import {Module} from "../../services/module.model";
import {NavParams, PopoverController} from "@ionic/angular";
import {Router} from "@angular/router";
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
              public navParams : NavParams,
              private router: Router) { }

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

  async getQuestionDetails() {
    await this.popoverController.dismiss();
    this.moduleService.currQuestion = this.navParams.get('qindex');
    console.log(this.moduleService.currQuestion);
    await this.router.navigate(['learn-mode']);
  }

  async startTestWith() {
    await console.log('startTestWith was called');
  }

}
