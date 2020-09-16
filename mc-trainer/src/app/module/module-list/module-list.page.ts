import { Component, OnInit } from '@angular/core';
import {ModuleService} from '../../../services/module.service';
import {PopoverController} from '@ionic/angular';
import {PopoverPage} from '../../popover/popover.page';
import {Router} from '@angular/router';
import {AlertController, ModalController} from '@ionic/angular';


@Component({
    selector: 'app-module-list',
    templateUrl: './module-list.page.html',
    styleUrls: ['./module-list.page.scss'],
})
export class ModuleListPage implements OnInit {

    private searchBool = false;
    private lessons: any[] = [];
    private lesson = {name: 'Compilerbau', cards: 42, tags: ['Programming', 'Computer Science', 'Something more']};

    constructor(public popoverController: PopoverController,
                private router: Router,
                private moduleService: ModuleService,
                private alertController: AlertController,
                private modalController: ModalController) {
        for (let i = 0; i < 5; i++) {
            this.lessons.push(this.lesson);
        }
    }

  ngOnInit() {
    this.moduleService.getUserModules();
  }

    playLesson() {
        console.log('playlesson called');
    }

    async popover(ev: any) {
        const popover = await this.popoverController.create({
            component: PopoverPage,
            cssClass: 'my-custom-class',
            event: ev,
            translucent: true
        });
        return await popover.present();
    }

}
