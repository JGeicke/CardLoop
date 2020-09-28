import { Component, OnInit } from '@angular/core';
import {ModuleService} from '../../services/module.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  constructor(private moduleService: ModuleService, private router: Router) { }

  ngOnInit() {
  }

  restartLesson(){
    this.router.navigate(['learn-mode']);
  }

}
