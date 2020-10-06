import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionStorageService {

  storage: any;
  module: any;
  constructor() {
    this.storage = null;
    this.module = null;
  }

  resetStorage(){
    this.storage = null;
  }
  resetModule(){
    this.module = null;
  }
}
