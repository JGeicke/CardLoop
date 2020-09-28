import { Component, OnInit } from '@angular/core';
import {ModuleService} from "../../../services/module.service";

@Component({
  selector: 'app-module-detail',
  templateUrl: './module-detail.page.html',
  styleUrls: ['./module-detail.page.scss'],
})
export class ModuleDetailPage implements OnInit {

  private picked = 'questions';
  questions_arr = [1, 2, 3, 4, 5, 6];

  constructor(private moduleService: ModuleService) { }

  ngOnInit() {
  }

  segmentChanged($event: any) {
    console.log('segment changed triggered');
  }

  playLesson(module: any) {
    console.log('playlesson called')
  }
}
