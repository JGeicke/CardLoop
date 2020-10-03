import { Component, OnInit } from '@angular/core';
import {ModuleService} from "../../../services/module.service";

@Component({
  selector: 'app-add-modules',
  templateUrl: './add-modules.page.html',
  styleUrls: ['./add-modules.page.scss'],
})
export class AddModulesPage implements OnInit {

  private picked = 'general';
  private moduleTitle = 'Your Title';
  private moduleTags = '#yourtag';
  private moduleDesc = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr,' +
      ' sed diam nonumy eirmod tempor invidunt ut labore.';
  private moduleColor = '#cf5d5d';
  private color_arr= ['#BA6363', '#97BF78', '#8D779D', '#C29157', '#D1B963', '#466078', '#428F81', '#BB769B'];

  constructor(private moduleService: ModuleService) { }

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
