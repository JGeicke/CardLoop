import { Component, OnInit } from '@angular/core';
import {ModuleService} from '../../../services/module.service';

@Component({
  selector: 'app-learn-mode',
  templateUrl: './learn-mode.page.html',
  styleUrls: ['./learn-mode.page.scss'],
})
export class LearnModePage implements OnInit {

  constructor(private moduleService: ModuleService) { }

  ngOnInit() {
  }

}
