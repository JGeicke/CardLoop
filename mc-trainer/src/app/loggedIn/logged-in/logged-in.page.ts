import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logged-in',
  templateUrl: './logged-in.page.html',
  styleUrls: ['./logged-in.page.scss'],
})
export class LoggedInPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  playLesson(){
    console.log('playlesson called');
  }

}
