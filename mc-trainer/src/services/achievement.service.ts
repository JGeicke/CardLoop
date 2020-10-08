import { Injectable } from '@angular/core';
import {StatisticService} from './statistic.service';
import {Achievement} from './achievement.model';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {

  /**
   * list of all achievements
   */
  achievements: Achievement[] = [];

  /**
   * achievement of user with the most progress but not yet completed
   */
  nextAchievement: Achievement;

  /**
   * number of achievements completed by the user
   */
  achievementsCompleted: number;

  /**
   * achievement to inspect
   */
  currAchievement: Achievement;

  /**
   * toggle of currAchievement details on achievementPage
   */
  detailAchievement: boolean;

  constructor(private statisticService: StatisticService, private authService: AuthService) {
    this.achievementsCompleted = 0;
    this.generateAchievements(0);
  }

  /**
   * generates achievements of user based on user stats
   * @param userModulesLength - number of modules imported by user (typically userModules.length)
   */
  generateAchievements(userModulesLength: number){
    this.achievements = [];
    this.achievementsCompleted = 0;
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
        'Answer a Question correctly!', correctQuestionCount > 1 ? 1 : correctQuestionCount , 1, 'achievement.svg'));

    this.achievements.push(new Achievement('2', 'CorrectQuestions2',
        'Answer 42 Questions correctly!', correctQuestionCount > 42 ? 42 : correctQuestionCount , 42, 'achievement.svg'));

    this.achievements.push(new Achievement('3', 'CorrectQuestions3',
        'Answer 250 Question correctly!', correctQuestionCount > 250 ? 250 : correctQuestionCount , 250, 'achievement.svg'));

    this.achievements.push(new Achievement('4', 'LessonStreak1',
        'Finish 10 Lessons!', lessonCount > 10 ? 10 : lessonCount , 10, 'playing-cards.svg'));

    this.achievements.push(new Achievement('5', 'LessonStreak2',
        'Finish 50 Lessons!', lessonCount > 50 ? 50 : lessonCount , 50, 'playing-cards.svg'));

    this.achievements.push(new Achievement('6', 'LessonStreak3',
        'U got 99 problems but lessons ain\'t one!', lessonCount > 99 ? 99 : lessonCount , 99, 'playing-cards.svg'));

    this.achievements.push(new Achievement('7', 'FinishLesson',
        'Finish your first Lesson!', lessonCount > 1 ? 1 : lessonCount, 1, 'playing-cards.svg'));

    this.achievements.push(new Achievement('10', 'ImportLesson',
        'Import your first Lesson!', imported > 1 ? 1 : imported, 1, 'apple.svg'));

    this.achievements.push(new Achievement('11', 'ImportLessonStreak',
        'Import 5 Lessons!', imported > 5 ? 5 : imported, 5, 'apple.svg'));

    this.achievements.push(new Achievement('12', 'ImportLessonStreak2',
        'Import 50 Lessons!', imported > 50 ? 50 : imported, 50, 'apple.svg'));

    this.achievements.push(new Achievement('13', 'CardLoopAcc',
        'Create a CardLoop Account!', this.authService.isLoggedIn ? 1 : 0, 1, 'mountain_with_flag.svg'));

    // Check how many achievements the user completed
    for (const achievement of this.achievements){
      if (this.isSuccessAchievement(achievement)){
        this.achievementsCompleted++;
      }
    }

    this.achievements.push(new Achievement('8', 'AchieveAchievements',
        'Achieve 3 Achievements!', this.achievementsCompleted > 3 ? 3 : this.achievementsCompleted, 3, 'mountain_with_flag.svg'));

    this.achievementsCompleted += this.checkRecentlyAddedAchievement();

    this.achievements.push(new Achievement('9', 'AchieveAchievements2',
        'Achieve 7 Achievements!', this.achievementsCompleted > 7 ? 7 : this.achievementsCompleted, 7, 'mountain_with_flag.svg'));

    this.achievementsCompleted += this.checkRecentlyAddedAchievement();

    // Has to be last achievement
    this.achievements.push(new Achievement('14', 'AllAchievements',
        'Achieve ' + this.achievements.length + ' Achievements!', this.achievementsCompleted, this.achievements.length, 'mountain_with_flag.svg'));
    // Get next achievement
    this.getNextAchievement();
  }

  /**
   * checks if achievement is completed
   * @param achievement - achievement to check
   */
  isSuccessAchievement(achievement: Achievement): boolean {
    return achievement.currentNumber === achievement.maxNumber;
  }

  /**
   * sorting achievement array based on user progress of achievements
   */
  sortAchievements() {
    this.achievements.sort((a, b) => (a.currentNumber / a.maxNumber) > (b.currentNumber / b.maxNumber) ? -1 : 1);
  }

  /**
   * Check the recently added Achievement if it is completed. Used for "x achievements unlocked"-type of achievements
   */
  private checkRecentlyAddedAchievement(){
    if (this.isSuccessAchievement(this.achievements[this.achievements.length - 1])){
      return 1;
    }
    return 0;
  }

  /**
   * sets nextAchievement to the uncompleted achievement with the highest progress
   */
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

  hasProgress(achievement: Achievement): boolean {
    return achievement.currentNumber !== 0;
  }
}
