import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {

  constructor(private router: Router) {
    if (JSON.stringify(localStorage.getItem('newUser')) !== 'null' || JSON.stringify(localStorage.getItem('newUser')) == 'false') {
      this.router.navigate(['login']);
    }
  }

  onboardingFinish() {
    localStorage.setItem('newUser', 'false');
  }

  ngOnInit() {
  }

}
