import { Injectable } from '@angular/core';
import {StatisticService} from './statistic.service';
import {Achievement} from './achievement.model';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {

  achievements: Achievement[] = [];
  nextAchievement: Achievement;

  constructor(private statisticService: StatisticService, private authService: AuthService) {

  }

  generateAchievements(userModulesLength: number){
    this.achievements = [];
    let correctQuestionCount = 0;
    let lessonCount = 0;
    let imported = 0;

    // Get proper values if user is logged in
    if (this.authService.isLoggedIn){
      correctQuestionCount = this.statisticService.userStats.correctQuestionCount;
      lessonCount = this.statisticService.userStats.lessonCount;
      imported = userModulesLength;
    }

    this.achievements.push(new Achievement('1', 'CorrectQuestions',
        'Answer a Question correctly!', correctQuestionCount > 1 ? 1 : correctQuestionCount , 1, 'mountain_with_flag.svg'));

    this.achievements.push(new Achievement('2', 'CorrectQuestions2',
        'Answer 42 Questions correctly!', correctQuestionCount > 42 ? 42 : correctQuestionCount , 42, 'mountain_with_flag.svg'));

    this.achievements.push(new Achievement('3', 'CorrectQuestions3',
        'Answer 250 Question correctly!', correctQuestionCount > 250 ? 250 : correctQuestionCount , 250, 'mountain_with_flag.svg'));

    this.achievements.push(new Achievement('4', 'LessonStreak1',
        'Finish 10 Lessons!', lessonCount > 10 ? 10 : lessonCount , 10, 'mountain_with_flag.svg'));

    this.achievements.push(new Achievement('5', 'LessonStreak2',
        'Finish 50 Lessons!', lessonCount > 50 ? 50 : lessonCount , 50, 'mountain_with_flag.svg'));

    this.achievements.push(new Achievement('6', 'LessonStreak3',
        'U got 99 problems but lessons ain\'t one!', lessonCount > 99 ? 99 : lessonCount , 99, 'mountain_with_flag.svg'));

    this.achievements.push(new Achievement('7', 'FinishLesson',
        'Finish your first Lesson!', lessonCount > 1 ? 1 : lessonCount, 1, 'mountain_with_flag.svg'));

    this.achievements.push(new Achievement('10', 'ImportLesson',
        'Import your first Lesson!', imported > 1 ? 1 : imported, 1, 'mountain_with_flag.svg'));

    this.achievements.push(new Achievement('11', 'ImportLessonStreak',
        'Import 5 Lessons!', imported > 5 ? 5 : imported, 5, 'mountain_with_flag.svg'));

    this.achievements.push(new Achievement('12', 'ImportLessonStreak2',
        'Import 50 Lessons!', imported > 50 ? 50 : imported, 50, 'mountain_with_flag.svg'));

    this.achievements.push(new Achievement('13', 'CardLoopAcc',
        'Create a CardLoop Account!', this.authService.isLoggedIn ? 1 : 0, 1, 'mountain_with_flag.svg'));

    // Check how many achievements the user completed
    let completed = 0;
    for (const achievement of this.achievements){
      if (this.isSuccessAchievement(achievement)){
        completed++;
      }
    }

    this.achievements.push(new Achievement('8', 'AchieveAchievements',
        'Achieve 3 Achievements!', completed > 3 ? 3 : completed, 3, 'mountain_with_flag.svg'));

    completed += this.checkRecentlyAddedAchievement();

    this.achievements.push(new Achievement('9', 'AchieveAchievements2',
        'Achieve 7 Achievements!', completed > 7 ? 7 : completed, 7, 'mountain_with_flag.svg'));

    completed += this.checkRecentlyAddedAchievement();

    // Has to be last achievement
    this.achievements.push(new Achievement('14', 'AllAchievements',
        'Achieve ' + this.achievements.length + ' Achievements!', completed, this.achievements.length, 'mountain_with_flag.svg'));
    // Get next achievement
    this.getNextAchievement();
  }

  // returns if an achievement is a "success" (100%) achievement
  isSuccessAchievement(achievement: Achievement) {
    return achievement.currentNumber === achievement.maxNumber;
  }

  // sorts the achievement array
  sortAchievements() {
    this.achievements.sort((a, b) => (a.currentNumber / a.maxNumber) > (b.currentNumber / b.maxNumber) ? -1 : 1);
  }

  /**
   * Check recently added Achievement if it is completed. Used for "x achievements unlocked"-achievements
   */
  private checkRecentlyAddedAchievement(){
    if (this.isSuccessAchievement(this.achievements[this.achievements.length - 1])){
      return 1;
    }
    return 0;
  }

  getNextAchievement(){
    // Find all uncompleted achievements
    const achievementsInProgress = [];
    for (const achievement of this.achievements){
      if (achievement.currentNumber < achievement.maxNumber){
        achievementsInProgress.push(achievement);
      }
    }

    // Iterate all uncompleted achievements and find the one with most progress
    let nextAchievement: Achievement = null;
    for (const achievement of achievementsInProgress){
      if (nextAchievement === null){
        nextAchievement = achievement;
      } else {
        const currentAchievementProgress = achievement.currentNumber / achievement.maxNumber;
        const currentNextAchievementProgress = nextAchievement.currentNumber / nextAchievement.maxNumber;

        // Swap if current achievement in iteration got more progress than current next achievement
        if (currentAchievementProgress > currentNextAchievementProgress){
          nextAchievement = achievement;
        }
      }
    }
    this.nextAchievement = nextAchievement;
  }
}
