import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-module-list',
  templateUrl: './module-list.page.html',
  styleUrls: ['./module-list.page.scss'],
})
export class ModuleListPage implements OnInit {

  private searchBool = false;
  private lessons: any[] = [];
  private lesson = {name: 'Compilerbau', cards: 42, tags: ['Programming', 'Computer Science', 'Something more']};

  constructor() {
    for (let i = 0; i < 5; i++) {
      this.lessons.push(this.lesson);
    }
  }

  ngOnInit() {
  }

  playLesson() {
    console.log('playlesson called');
  }

  lessonDetails() {
    console.log('lessondetails called');
  }

}
