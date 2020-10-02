import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {AlertController, ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {ModuleService} from '../../../services/module.service';
import {Module} from '../../../services/module.model';
import {AchievementService} from '../../../services/achievement.service';

@Component({
    selector: 'app-logged-in',
    templateUrl: './logged-in.page.html',
    styleUrls: ['./logged-in.page.scss'],
})
export class LoggedInPage implements OnInit {

    recommendations: Module[] = [];
    recommendation = {name: 'Compilerbau', cards: 42, tags: ['Programming', 'Computer Science', 'Something more']};
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
        const sortedArray = this.moduleService.getMostPlayedModules();
        this.recommendations.push(sortedArray[0]);
        this.recommendations.push(sortedArray[1]);
        this.recommendations.push(sortedArray[2]);
    }

    ngOnInit() {
        if (this.authService.isLoggedIn === false) {
            this.loginModal();
        }
    }

    sumuptags(tag_arr: string[], tagIndex: number) {
        let sumtag: string = '';
        for (let i = 0; i < tagIndex; i++) {
            sumtag += tag_arr[i];
        }

        return sumtag.length;
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
        console.log(module);
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
                        console.log('Confirm Cancel: blah');
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
}
