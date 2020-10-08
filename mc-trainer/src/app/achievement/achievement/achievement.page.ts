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
  avgsessiontime: string;
  correctQuestCount: number;
  wrongQuestCount: number;
  lessonCount: number;
  questCount: number;
  regDate: string;
  achievementsCompleted: number;

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
    const userStats = this.statisticService.userStats;
    this.questCount = userStats.questionCount;
    this.correctQuestCount = userStats.correctQuestionCount;
    this.wrongQuestCount = this.questCount - this.correctQuestCount;
    this.lessonCount = userStats.lessonCount;
    this.avgsessiontime = userStats.averageSessionTime.toFixed(2);
    this.achievementsCompleted = this.achievementService.achievementsCompleted;
    const userRegDate = userStats.registrationDate;
    this.regDate = userRegDate.getDate() + '.' + (userRegDate.getMonth() + 1) + '.' + userRegDate.getFullYear();
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
    this.picked = 'achievements';
    // this.achievementService.detailAchievement = false;
    this.achievementService.generateAchievements(this.moduleService.userModules.length);
    this.achievementService.sortAchievements();
  }

    /**
     * Function for inspecting an achievement
     *
     * @param achievement the achievment that will be viewed in detail
     */
    inspectAchievement(achievement: Achievement) {
        this.achievementService.detailAchievement = !this.achievementService.detailAchievement;
        this.achievementService.currAchievement = achievement;
    }

  ngOnInit() {
    this.questCount = 0;
    this.correctQuestCount = 0;
    this.wrongQuestCount = 0;
    this.lessonCount = 0;
    this.avgsessiontime = '0';
    this.regDate = '00.00.0000';
  }

}
