import { Component, OnInit } from '@angular/core';
import {ModuleService} from '../../services/module.service';
import {Router} from '@angular/router';
import {StatisticService} from '../../services/statistic.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  data = [];
  view: any[] = [300, 300];

  // options
  gradient = false;
  showLegend = false;
  showLabels = false;
  isDoughnut = true;
  legendPosition = 'below';

  questionsInSession = 0;
  learnedQuestions = 0;
  unsureQuestions = 0;
  halfwayQuestions = 0;

  colorScheme = {
    domain: ['#cf5d5d', '#ffb763', '#66bd92']
  };


  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  constructor(private moduleService: ModuleService, private router: Router, private statisticService: StatisticService) {
  }

  ionViewDidEnter(){
    // returns array [unsure questions, halfway questions, learned questions] of session
    const sessionStats = this.statisticService.session.generateSessionStats();
    this.data = [
      {
        name: 'Unsure',
        value: sessionStats[0]
      },
      {
        name: 'Halfway',
        value: sessionStats[1]
      },
      {
        name: 'Learned',
        value: sessionStats[2]
      },
    ];
    this.questionsInSession = this.statisticService.session.getQuestionCount();
    this.unsureQuestions = sessionStats[0];
    this.halfwayQuestions = sessionStats[1];
    this.learnedQuestions = sessionStats[2];
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  restartLesson(){
    this.router.navigate(['learn-mode']);
  }

  ngOnInit(): void {
  }
}
