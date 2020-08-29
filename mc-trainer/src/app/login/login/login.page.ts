import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private emailInput: string;
  private passwordInput: string;

  constructor(private authService: AuthService) { }

  Register(){
    this.authService.Register(this.emailInput, this.passwordInput);
    this.ClearInput();
  }

  Login(){
    this.authService.SignIn(this.emailInput, this.passwordInput);
    this.ClearInput();
  }

  private ClearInput(){
    this.emailInput = '';
    this.passwordInput = '';
  }
  ngOnInit() {
  }

}
