import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {ModuleService} from '../../../services/module.service';
import {StatisticService} from '../../../services/statistic.service';
import {AchievementService} from '../../../services/achievement.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.page.html',
    styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

    private hasWarning = false;
    private hasAlert = false;
    private warningText = 'warning text';
    private alertText = 'alert Text';
    private loggedIn = true;
    private userMail = 'mail';
    private userPasswortDummy = '*************';
    private editMode = false;
    private userPW = '';
    private userPW2 = '';
    private userOldPW = '';


    constructor(private authService: AuthService, private router: Router,
                private moduleService: ModuleService, private statisticService: StatisticService,
                private achievementService: AchievementService) {
        this.loggedIn = this.authService.isLoggedIn;
        if (this.loggedIn) {
            this.userMail = this.authService.getUserMail();
        }
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.loggedIn = this.authService.isLoggedIn;
        if (this.loggedIn){
            this.userMail = this.authService.getUserMail();
        }
    }

    /**
     * redirect the view to the login page directly to the registration
     */
    redirectToRegister() {
        this.authService.registerTriggered = true;
        this.router.navigate(['login']);
    }

    /**
     * logs user out and routes to login-page
     */
    logOut(){
        // resets userModules, recentlyPlayed, recommendations and currLesson
        this.moduleService.resetUserModuleData();
        // logs the user out
        this.authService.SignOut();
        // Reset user stats
        this.statisticService.resetUserStats();
        // generates current achievements after removing user progress
        this.achievementService.generateAchievements(0);
        // get achievement with highest progress
        this.achievementService.getNextAchievement();
        // route back to login
        this.router.navigate(['login']);
    }

    cancelEdit(){
        this.editMode = false;
        this.hasWarning = false;
        this.hasAlert = false;
    }

    /**
     * checks the inputs and calls the auth service for the password change
     */
    startEdit() {
        if (this.authService.isLoggedIn) {
            if (!this.editMode) {
                this.editMode = true;
            } else {
                // check if all fields are filled
                if (this.userPW === '' || this.userPW2 === '' || this.userOldPW === '') {
                    this.warningText = 'Please fill all fields.';
                    this.hasWarning = true;
                } else {
                    // check if new passwords are identical
                    if (this.userPW !== this.userPW2) {
                        this.warningText = 'Passwords don´t match!';
                        this.hasWarning = true;
                    } else {
                        if (this.userPW.length < 6) {
                            this.warningText = 'Password must be at leat 6 characters long!';
                            this.hasWarning = true;
                        } else {
                            // check if old password is correct
                            if (!this.authService.checkPassword(this.userOldPW)) {
                                this.warningText = 'Old Password is wrong!';
                                this.hasWarning = true;
                            } else {
                                this.authService.changePassword(this.userPW);
                                this.editMode = false;
                            }
                        }

                    }
                }
            }
        }
    }

    /**
     * starts the delete account prozess
     */
    deleteAccount() {
        this.authService.startDeleteUser();
    }


}
