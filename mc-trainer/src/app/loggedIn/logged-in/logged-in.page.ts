import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {AlertController, ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {ModuleService} from '../../../services/module.service';

@Component({
    selector: 'app-logged-in',
    templateUrl: './logged-in.page.html',
    styleUrls: ['./logged-in.page.scss'],
})
export class LoggedInPage implements OnInit {

    recommendations: any[] = [];
    recommendation = {name: 'Compilerbau', cards: 42, tags: ['Programming', 'Computer Science', 'Something more']};
    sliderConfig = {
        spaceBetween: 10,
        slidesPerView: 1.4
    };

    constructor(private router: Router,
                private authService: AuthService,
                private alertController: AlertController,
                public modalController: ModalController,
                private moduleService: ModuleService) {
        this.recommendations.push(this.recommendation);
        this.recommendations.push(this.recommendation);
        this.recommendations.push(this.recommendation);
    }

    ngOnInit() {
        if (this.authService.isLoggedIn === false) {
            this.loginModal();
        }
    }

    playLesson() {
        console.log('playlesson called');
    }

    lessonDetails() {
        console.log('lessondetails called');
    }

    async loginModal() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Didn\'t sign into an account yet?',
            message: 'Play around, have fun and whenever you' +
                ' feel like it or when you want to save all ' +
                'your progress. You can sign up by clicking ' +
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
