import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  public currLesson;
  public lessons = [];
  private lesson = {name: 'Compilerbau', cards: 42, tags: ['Programming', 'Computer Science', 'Something more']};


  constructor() {
    for (let i = 0; i < 5; i++) {
      this.lessons.push(this.lesson);
    }
  }

  lessonDetails(currLesson) {
    console.log(currLesson);
  }

  deleteLesson(currLesson) {
    console.log(currLesson);
  }
}
