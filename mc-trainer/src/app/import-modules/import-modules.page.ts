import {Component, OnInit, ViewChild} from '@angular/core';
import {ModuleService} from '../../services/module.service';
import {Module} from '../../services/module.model';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-import-modules',
    templateUrl: './import-modules.page.html',
    styleUrls: ['./import-modules.page.scss'],
})
export class ImportModulesPage implements OnInit {

    @ViewChild('search') search: any;
    private searchQuery: string;
    private searchBool;
    private filteredModule: Module[];
    private lessons: Module[] = [];

    constructor(private moduleService: ModuleService,
                private router: Router,
                private authService: AuthService) {
        this.lessons = this.moduleService.allModules;
        this.filteredModule = this.moduleService.allModules;
    }

    ngOnInit() {
    }

    /**
     * Toggles search mode for all modules and sets the focus onto the searchbar
     */
    focusButton(): void {
        this.searchBool = true;
        setTimeout(() => {
            this.search.setFocus();
        }, 500);
    }

    /**
     * eventHandler for the searchBar change action
     *
     * filters the Module list
     */
    searchModules() {
        console.log(this.searchBool);
        this.filteredModule = this.moduleService.searchModules(this.moduleService.allModules, this.searchQuery);
    }

    /**
     * Turns search mode of imported modules off - all modules are displayed again
     *
     */
    cancelSearch() {
        this.searchBool = false;
        console.log(this.searchBool);
    }

    /**
     * imports a Module for the logged in User
     *
     * @param module the Module to be imported
     */
    importClicked(module: Module) {
        this.moduleService.importModule(module);
    }

    /**
     * redirects the view to learn-mode
     *
     * @param module the module that will be loaded in the learn view
     */
    playClicked(module: Module) {
        this.moduleService.currLesson = module;
        this.moduleService.recentlyPlayed = module;
        this.moduleService.saveRecentlyPlayed();
        this.router.navigate(['learn-mode']);
    }

}
