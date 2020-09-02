import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  private emailInput: string;
  private passwordInput: string;
  private passwordConfirmationInput: string;
  private showLogin = true;

  private warningText: string;
  private hasWarning = false;
  private hasAlert = false;
  private alertText = 'Placeholder';

  constructor(private authService: AuthService, private router: Router) { }

  // Create new Account
  Register() {
    if (this.emailInput.length !== 0 && this.passwordInput.length !== 0 && this.matchPassword()) {
      this.authService.Register(this.emailInput, this.passwordInput).then((res) => {
        if (res === 'auth/email-already-in-use'){
          this.warningText = 'Email already in use!';
          if (!this.hasWarning){
            this.toggleWarning();
          }
        } else if (res === ''){
          // Successful registration
          this.toggleLogin();
          this.alertText = 'Registered successfully!';
          if (!this.hasAlert){
            this.toggleAlert();
          }
        } else{
          console.log(res);
        }
      });
    } else if (!this.matchPassword()){
      this.warningText = 'Passwords do not match!';
      if (!this.hasWarning){
        this.toggleWarning();
      }
      // Clear passwords
      this.passwordInput = '';
      this.passwordConfirmationInput = '';
    }
  }


  // Log into account
  Login(){
    this.authService.SignIn(this.emailInput, this.passwordInput).then((res) =>  {
      if (res === 'auth/wrong-password'){
        this.warningText = 'Wrong password!';
        if (!this.hasWarning) {
          this.toggleWarning();
        }
      } else {
        this.warningText = 'Account not found!';
        if (!this.hasWarning){
          this.toggleWarning();
        }
      }
    });
    this.ClearInput();
    this.router.navigate(['logged-in']);
  }

  // Toggles Login-View/Sign-Up View
  private toggleLogin(){
    this.showLogin = !this.showLogin;
    this.hasWarning = false;
    this.hasAlert = false;
    this.ClearInput();
  }

  // Toggles warning text
  private toggleWarning(){
    this.hasWarning = !this.hasWarning;
    setTimeout(() => this.hasWarning = false, 5000);
  }

  // Toggles alert text
  private toggleAlert(){
    this.hasAlert = !this.hasAlert;
    setTimeout(() => this.hasAlert = false, 5000);
  }

  // Clears all input forms
  private ClearInput(){
    this.emailInput = '';
    this.passwordInput = '';
    this.passwordConfirmationInput = '';
  }

  // Checks if password matches password confirmation
  private matchPassword(): boolean{
    return this.passwordInput === this.passwordConfirmationInput;
  }
  ngOnInit() {
  }

}
