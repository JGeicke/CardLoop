import { Component, OnInit } from '@angular/core';
import {ModuleService} from '../../services/module.service';
import {Router} from '@angular/router';
import {StatisticService} from '../../services/statistic.service';
import {AuthService} from '../../services/auth.service';
import {AchievementService} from '../../services/achievement.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  private picked;

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
    domain: ['#66bd92', '#cf5d5d']
  };


  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  constructor(private moduleService: ModuleService, private router: Router,
              private statisticService: StatisticService, private authService: AuthService,
              private achievementService: AchievementService) {
  }

  ionViewDidEnter(){
    // returns array [unsure questions, halfway questions, learned questions] of session
    const sessionStats = this.statisticService.session.generateSessionStats();
    this.data = [
      {
        name: 'Right',
        value: this.statisticService.session.rightQuestions.length
      },
      {
        name: 'Wrong',
        value: this.statisticService.session.wrongQuestions.length
      },
    ];
    this.questionsInSession = this.statisticService.session.getQuestionCount();
    this.unsureQuestions = sessionStats[0];
    this.halfwayQuestions = sessionStats[1];
    this.learnedQuestions = sessionStats[2];
    this.statisticService.generateUserStats(this.authService.GetUID(), this.statisticService.session);
    this.achievementService.generateAchievements(this.moduleService.userModules.length);
  }

  /**
   *
   * @param $event that is triggered when the segement of the button switches sides
   */
  segmentChanged(ev: any) {
    console.log(this.picked);
  }


  /**
   * routes the view to the learn-mode page
   */
  restartLesson(){
    this.router.navigate(['learn-mode']);
  }

  ngOnInit(): void {
    this.picked = 'results';
  }
}
