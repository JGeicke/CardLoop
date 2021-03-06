import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {IonInput, LoadingController, ViewWillEnter} from '@ionic/angular';
import {ModuleService} from '../../../services/module.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, ViewWillEnter {

    private emailInput = '';
    private passwordInput = '';
    private passwordConfirmationInput = '';
    private showLogin = true;

    private warningText: string;
    private hasWarning = false;
    private hasAlert = false;
    private alertText: string;
    private saveUser = false;
    private user: any;


    private loginSpinner: boolean;
    @ViewChild('loginMail')
    private loginEmailInput: IonInput;
    @ViewChild('signUpMail')
    private signUpEmailInput: IonInput;

    constructor(private authService: AuthService, private router: Router, private moduleService: ModuleService,
                private loadingController: LoadingController) {
        if (this.authService.registerTriggered) {
            this.toggleLogin();
        }
        if (JSON.parse(localStorage.getItem('saveUser')) === true) {
            if (localStorage.getItem('user') != null) {
                this.saveUser = true;
                this.user = JSON.parse(localStorage.getItem('user'));
                this.emailInput = this.user.email;
                this.passwordInput = this.user.password;
                this.Login();
            }
        }
    }

    ngOnInit() {
        if (localStorage.getItem('user') != null) {
            this.user = JSON.parse(localStorage.getItem('user'));
            this.emailInput = this.user.email;
            this.passwordInput = this.user.password;
            this.saveUser = true;
        }
    }

    ionViewWillEnter(): void {
        this.hasWarning = false;
        this.hasAlert = false;
        if (localStorage.getItem('saveUser') === null || localStorage.getItem(('saveUser')) === 'false') {
            this.saveUser = false;
        } else {
            this.saveUser = true;
            this.user = JSON.parse(localStorage.getItem('user'));
            this.emailInput = this.user.email;
            this.passwordInput = this.user.password;
            this.Login();
        }
    }

    ionViewDidLeave() {
        this.ClearInput();
        this.loginSpinner = false;
    }


    /**
     * handles the registration process
     */
    Register() {
        const email = this.emailInput;
        const pass = this.passwordInput;
        if (this.emailInput.length !== 0 && this.passwordInput.length !== 0 && this.matchPassword()) {
            this.authService.Register(this.emailInput, this.passwordInput).then((res) => {
                if (res === 'auth/email-already-in-use') {
                    this.warningText = 'Email already in use!';
                    if (!this.hasWarning) {
                        this.toggleWarning();
                    }
                    // email invalid e.g. 't@t.t'
                } else if (res === 'auth/invalid-email') {
                    this.warningText = 'Email is not valid!';
                    if (!this.hasWarning) {
                        this.toggleWarning();
                    }
                    // password to weak e.g. '1'
                } else if (res === 'auth/weak-password') {
                    this.warningText = 'Weak password!';
                    if (!this.hasWarning) {
                        this.toggleWarning();
                    }
                } else if (res === '') {
                    // Successful registration
                    this.toggleLogin();
                    this.emailInput = email;
                    this.passwordInput = pass;
                    this.saveUser = true;
                    this.Login();
                    this.alertText = 'Registered successfully!';
                    if (!this.hasAlert) {
                        this.toggleAlert();
                    }
                }
            });
        } else if (!this.matchPassword()) {
            this.warningText = 'Passwords do not match!';
            if (!this.hasWarning) {
                this.toggleWarning();
            }
        } else if (this.emailInput.length === 0) {
            this.warningText = 'Email was empty!';
            if (!this.hasWarning) {
                this.toggleWarning();
            }
        }
    }


    /**
     * handles the login process
     */
    async Login() {
        // No email input
        if (this.emailInput.length === 0) {
            this.warningText = 'Email was empty!';
            if (!this.hasWarning) {
                this.toggleWarning();
            }
            // no password input
        } else if (this.passwordInput.length === 0) {
            this.warningText = 'Password was empty';
            if (!this.hasWarning) {
                this.toggleWarning();
            }
        } else {
            let success = false;
            await this.authService.SignIn(this.emailInput, this.passwordInput).then((res) => {
                // wrong password
                if (res === 'auth/wrong-password') {
                    this.warningText = 'Wrong password!';
                    if (!this.hasWarning) {
                        this.toggleWarning();
                    }
                    // other errors
                } else if (res !== '') {
                    this.warningText = 'Account not found!';
                    if (!this.hasWarning) {
                        this.toggleWarning();
                    }
                    // successful login
                } else {
                    success = true;
                }
            });
            if (success) {
                if (this.saveUser) {
                    localStorage.setItem('saveUser', JSON.parse('true'));
                    this.authService.rememberUser();
                }
                await this.moduleService.getUserModules(true);
            }
        }
    }

    /**
     * Toggles Login-View/Sign-Up View
     */
    private toggleLogin() {
        this.authService.registerTriggered = false;
        this.showLogin = !this.showLogin;
        this.hasWarning = false;
        this.hasAlert = false;
        this.ClearInput();
        // Work around so that @ViewChild isn't undefined after swapping between views
        setTimeout(() => {
            this.setFocusOnMail();
        }, 250);
    }

    /**
     * Toggles warning text
     */
    private toggleWarning() {
        this.hasWarning = !this.hasWarning;
        if (this.hasWarning && this.hasAlert) {
            this.toggleAlert();
        }
    }

    /**
     * Toggles alert text
     */
    private toggleAlert() {
        this.hasAlert = !this.hasAlert;
        // setTimeout(() => this.hasAlert = false, 5000);
    }

    /**
     * Lifecycle handling to enhance UX
     */
    ionViewDidEnter() {
        this.setFocusOnMail();
    }

    /**
     * Focus first Input element
     */
    private setFocusOnMail() {
        if (this.showLogin) {
            this.loginEmailInput.setFocus();
        } else {
            this.signUpEmailInput.setFocus();
        }
    }

    /**
     * Clears all input forms
     */
    private ClearInput() {
        this.emailInput = '';
        this.passwordInput = '';
        this.passwordConfirmationInput = '';
    }

    /**
     * Checks if password matches password confirmation
     */
    private matchPassword(): boolean {
        return this.passwordInput === this.passwordConfirmationInput;
    }

}
