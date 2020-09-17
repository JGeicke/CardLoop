import {Component, OnInit, ViewChild} from '@angular/core';
import { ModuleService } from '../../services/module.service';

@Component({
    selector: 'app-import-modules',
    templateUrl: './import-modules.page.html',
    styleUrls: ['./import-modules.page.scss'],
})
export class ImportModulesPage implements OnInit {

    @ViewChild('search') search: any;
    private searchstring: string;

    private lessons: any[] = [{
        id: 1,
        name: 'Compilerbau',
        cards: 42,
        tags: ['Programming', 'Computer Science', 'Something more']
    },
        {id: 2, name: 'Diskrete Mathe', cards: 31, tags: ['Mathe', 'Abfuck', 'Hoffentlich bestanden']},
        {id: 3, name: 'Capitols of Africa', cards: 12, tags: ['Geography', 'Cities', 'Continent']},
        {id: 4, name: 'Big Data', cards: 17, tags: ['Data', 'Hadoop', 'Hive']},
        {id: 5, name: 'Business Analytics', cards: 58, tags: ['Power BI', 'Data Driven', 'Statistics']}
    ];
    private cats: any[] = [{category: 'Programming'}, {category: 'Mathematics'}, {category: 'English'},
        {category: 'Science'}, {category: 'General'}, {category: 'Geography'}];

    constructor(private moduleService: ModuleService) {
        moduleService.getAllModules();
        this.lessons = this.moduleService.allModules;
    }

    ionViewWillEneter(){

    }

    ngOnInit() {
    }

    focusButton(): void {
        setTimeout(() => {
            this.search.setFocus();
        }, 500);
    }

}
