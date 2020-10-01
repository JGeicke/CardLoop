import {Component, OnInit} from '@angular/core';
import {Achievement} from '../../../services/achievement.model';

@Component({
    selector: 'app-achievement',
    templateUrl: './achievement.page.html',
    styleUrls: ['./achievement.page.scss'],
})

// Achievement Page Front End Logic
export class AchievementPage implements OnInit {

    achievements: Achievement[] = [];
    detailAchievement: boolean;
    currAchievement: Achievement;

    constructor() {
        this.detailAchievement = false;
        this.makeAchievementSample();
        this.sortAchievements();
    }

    // Example Data, maybe change some icons
    makeAchievementSample() {
        this.achievements.push(new Achievement('1', 'CardStreak',
            'Achieve a streak of 6 right answered cards in a row!', 3, 6, 'mountain_with_flag.svg'));
        this.achievements.push(new Achievement('2', 'LessonStreak',
            'Finish 3 Lessons!', 1, 2, 'mountain_with_flag.svg'));
        this.achievements.push(new Achievement('3', 'FinishLesson',
            'Finish your first Lesson!', 1, 1, 'mountain_with_flag.svg'));
        this.achievements.push(new Achievement('4', 'AchieveAchievements',
            'Achieve 3 Achievements!', 1, 3, 'mountain_with_flag.svg'));
        this.achievements.push(new Achievement('5', 'ImportLesson',
            'Import your first Lesson!', 1, 1, 'mountain_with_flag.svg'));
        this.achievements.push(new Achievement('6', 'ImportLessonStreak',
            'Import 5 Lessons!', 2, 5, 'mountain_with_flag.svg'));
        this.achievements.push(new Achievement('7', 'EditProfile',
            'Change your Password atleast one time!', 0, 1, 'mountain_with_flag.svg'));
        this.achievements.push(new Achievement('8', 'CardLoopAcc',
            'Create a CardLoop Account!', 1, 1, 'mountain_with_flag.svg'));
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


    /**
     * returns if an achievement is a "success" (100%) achievement
     *
     * @param achievement the achievment in question
     */
    isSuccessAchievement(achievement: Achievement) {
        return achievement.currentNumber / achievement.maxNumber === 1;
    }

    /**
     * sorts the achievement array
     */
    sortAchievements() {
        this.achievements.sort((a, b) => (a.currentNumber / a.maxNumber) > (b.currentNumber / b.maxNumber) ? -1 : 1);
    }

    // only for testing while "login" is not implemented yet. turn false for "not being logged in"
    // Later implement here the check, if a User is logged in
    isLoggedIn() {
        // TODO: do this
        return false;
    }

    ngOnInit() {
    }

}
