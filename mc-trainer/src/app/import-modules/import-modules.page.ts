import {Component, OnInit, ViewChild} from '@angular/core';
import { ModuleService } from '../../services/module.service';
import {Module} from "../../services/module.model";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-import-modules',
    templateUrl: './import-modules.page.html',
    styleUrls: ['./import-modules.page.scss'],
})
export class ImportModulesPage implements OnInit {

    @ViewChild('search') search: any;
    private searchstring: string;

    private lessons: any[] = [];

    constructor(private moduleService: ModuleService, private router: Router) {
        this.lessons = this.moduleService.allModules;
    }

    ngOnInit() {
    }

    focusButton(): void {
        setTimeout(() => {
            this.search.setFocus();
        }, 500);
    }

    importClicked(module: Module){
        this.moduleService.importModule(module);
    }

    playClicked(module: Module){
        this.moduleService.currLesson = module;
        this.router.navigate(['learn-mode']);
    }

    moduleDetailClicked(module: Module){
        console.log('lesson deatil clicked');
        // TODO: redirect to lesson Deatil page
    }

}
