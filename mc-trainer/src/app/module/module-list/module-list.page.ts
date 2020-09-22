import { Component, OnInit } from '@angular/core';
import {ModuleService} from '../../../services/module.service';
import {PopoverController} from '@ionic/angular';
import {PopoverPage} from '../../popover/popover.page';
import {Router} from '@angular/router';
import {AlertController, ModalController} from '@ionic/angular';
import {Module} from '../../../services/module.model';


@Component({
    selector: 'app-module-list',
    templateUrl: './module-list.page.html',
    styleUrls: ['./module-list.page.scss'],
})
export class ModuleListPage implements OnInit {

    private searchBool = false;
    private searchQuery = '';
    private filteredModules: Module[] = [];

    constructor(public popoverController: PopoverController,
                private router: Router,
                private moduleService: ModuleService,
                private alertController: AlertController,
                private modalController: ModalController) {
    }

    searchModules(){
        this.searchBool = true;
        this.filteredModules = this.moduleService.searchModules(this.moduleService.userModules, this.searchQuery);
        this.filteredModules.forEach(module => console.log(module));
    }

  ngOnInit() {
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
