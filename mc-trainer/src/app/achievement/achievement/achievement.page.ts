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

  detailAchievement: boolean;
  currAchievement: Achievement;

  constructor(private statisticService: StatisticService, private authService: AuthService,
              private moduleService: ModuleService, private achievementService: AchievementService) {
  }

  ionViewWillEnter(){
    this.detailAchievement = false;
    this.achievementService.generateAchievements(this.moduleService.userModules.length);
    this.achievementService.sortAchievements();
  }

  // Function for inspecting an achievement
  inspectAchievement(achievement: Achievement) {
    this.detailAchievement = !this.detailAchievement;
    this.currAchievement = achievement;
  }

  ngOnInit() {
  }

}
