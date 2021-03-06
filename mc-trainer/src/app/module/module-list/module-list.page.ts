import {Component, OnInit} from '@angular/core';
import {ModuleService} from '../../../services/module.service';
import {PopoverController} from '@ionic/angular';
import {PopoverPage} from '../../popover/popover.page';
import {Router} from '@angular/router';
import {AlertController, ModalController} from '@ionic/angular';
import {Module} from '../../../services/module.model';
import {AuthService} from '../../../services/auth.service';


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
                private modalController: ModalController,
                private authService: AuthService) {
    }

    ionViewWillEnter(){
    }

    /**
     * event handler for the change action on the search field
     */
    searchModules() {
        this.searchBool = true;
        this.filteredModules = this.moduleService.searchModules(this.moduleService.userModules, this.searchQuery);
    }

    ngOnInit() {
    }

    /**
     * redirect to learn-mode to learn a module
     * @param module the module which will be learned
     */
    playLesson(module) {
        this.moduleService.currLesson = module;
        this.moduleService.recentlyPlayed = module;
        this.moduleService.saveRecentlyPlayed();
        this.router.navigate(['learn-mode']);
    }

    /**
     * presents the popover to see lesson details or delete the lessons of the user
     * @param ev the click event
     * @param module    the clicked module
     */
    async popover(ev: any, module: Module) {
        const popover = await this.popoverController.create({
            component: PopoverPage,
            cssClass: 'my-custom-class',
            event: ev,
            translucent: true,
            componentProps: {from: 'module-list'}
        });
        return await popover.present();
    }

}
