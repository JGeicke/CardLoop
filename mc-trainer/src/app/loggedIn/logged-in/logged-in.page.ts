import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {AlertController, ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {ModuleService} from '../../../services/module.service';
import {Module} from '../../../services/module.model';
import {AchievementService} from '../../../services/achievement.service';
import {Question} from '../../../services/question.model';

@Component({
    selector: 'app-logged-in',
    templateUrl: './logged-in.page.html',
    styleUrls: ['./logged-in.page.scss'],
})
export class LoggedInPage implements OnInit {

    sliderConfig = {
        spaceBetween: 10,
        slidesPerView: 1.4
    };

    constructor(private router: Router,
                private authService: AuthService,
                private alertController: AlertController,
                public modalController: ModalController,
                private moduleService: ModuleService,
                private achievementService: AchievementService) {
    }

    ionViewWillEnter(){
        this.achievementService.generateAchievements(this.moduleService.userModules.length);
    }

    ngOnInit() {
        if (this.authService.isLoggedIn === false) {
            this.loginModal();
        }
    }

    /**
     * redirect the view to learn-mode to learn a module
     *
     * @param module the module that will be learned
     */
    playLesson(module: Module) {
        if (!this.moduleService.isModuleImported(module)) {
            this.moduleService.importModule(module);
        }
        this.moduleService.currLesson = module;
        this.moduleService.recentlyPlayed = module;
        this.moduleService.saveRecentlyPlayed();
        this.router.navigate(['learn-mode']);
    }

    /**
     * displays the not logged in message
     */
    async loginModal() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Didn\'t sign into an account yet?',
            message: 'You can sign up by clicking ' +
                'the button above!',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                    }
                }, {
                    text: 'Go Back',
                    handler: () => {
                        this.router.navigate(['/login']);
                    }
                }
            ]
        });

        await alert.present();
    }

    inspectNextAchievement(){
        this.achievementService.currAchievement = this.achievementService.nextAchievement;
        this.achievementService.detailAchievement = true;
        this.router.navigate(['achievement']);
    }
}
