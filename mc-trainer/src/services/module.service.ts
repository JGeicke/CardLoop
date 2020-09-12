import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  imported = false;
  constructor() { }

  importLesson() {
    console.log('importlesson called');
  }

  lessonDetails(id) {
    console.log(id);
  }
}
