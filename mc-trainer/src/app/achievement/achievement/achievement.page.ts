import {Component, OnInit} from '@angular/core';
import {Achievement} from '../../../services/achievement.model';
import {StatisticService} from '../../../services/statistic.service';
import {AuthService} from '../../../services/auth.service';
import {ModuleService} from '../../../services/module.service';
import {AchievementService} from '../../../services/achievement.service';

@Component({
  selector: 'app-achievement',
  templateUrl: './achievement.page.html',
  styleUrls: ['./achievement.page.scss'],
})

// Achievement Page Front End Logic
export class AchievementPage implements OnInit {

  // statistics variables
  picked: string;
  detailAchievement: boolean;
  currAchievement: Achievement;
  avgsessiontime: number;
  correctQuestCount: number;
  wrongQuestCount: number;
  lessonCount: number;
  questCount: number;
  regDate: string;

  data = [];
  view: any[] = [300, 300];

  // piechart variables

  gradient = false;
  showLegend = false;
  showLabels = false;
  isDoughnut = false;
  legendPosition = 'below';

  colorScheme = {
    domain: ['#66bd92', '#cf5d5d']
  };

  constructor(private statisticService: StatisticService, private authService: AuthService,
              private moduleService: ModuleService, private achievementService: AchievementService) {
  }

  ionViewWillEnter(){
    this.data = [
      {
        name: 'Correct',
        value: this.correctQuestCount
      },
      {
        name: 'Wrong',
        value: this.wrongQuestCount
      },
    ];
    console.log(typeof this.correctQuestCount);
    console.log(typeof this.questCount);
    this.picked = 'statistics';
    this.detailAchievement = false;
    this.achievementService.generateAchievements(this.moduleService.userModules.length);
    this.achievementService.sortAchievements();
  }

    /**
     * Function for inspecting an achievement
     *
     * @param achievement the achievment that will be viewed in detail
     */
    inspectAchievement(achievement: Achievement) {
        this.detailAchievement = !this.detailAchievement;
        this.currAchievement = achievement;
    }

  ngOnInit() {
    this.avgsessiontime = 10.4736;
    this.correctQuestCount = 7;
    this.questCount = 12;
    this.lessonCount = 10;
    this.wrongQuestCount = this.questCount - this.correctQuestCount ;
    this.regDate = '29.07.2020';
  }

}
