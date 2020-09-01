import {Component, OnInit} from '@angular/core';
import {Achievement} from '../../../services/achievement.model';
import {RoundProgressModule} from 'angular-svg-round-progressbar';

@Component({
  selector: 'app-achievement',
  templateUrl: './achievement.page.html',
  styleUrls: ['./achievement.page.scss'],
})
export class AchievementPage implements OnInit {

  achievements: Achievement[] = [];
  prog: Achievement = new Achievement('1', 'CardStreak',
      'Achieve a streak of 6 right answered cards in a row!', 3, 6, './src/assets/mountain_with_flag');

  constructor() {
    console.log('hi');
    this.achievements.push(new Achievement('1', 'CardStreak',
        'Achieve a streak of 6 right answered cards in a row!', 3, 6, './src/assets/mountain_with_flag'));
  }

  ngOnInit() {
  }

}
