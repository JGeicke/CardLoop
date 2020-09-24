import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.page.html',
    styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

    private hasWarning: boolean = false;
    private hasAlert: boolean = false;
    private warningText: string = "warning text";
    private alertText: string = "alert Text";
    private loggedIn: boolean = true;
    private userMail: string = 'mail'
    private userPasswortDummy: string = '*************';
    private editMode: boolean = false;
    private userPW: string = '';
    private userPW2: string = '';
    private userOldPW: string = '';


    constructor(private authService: AuthService, private router: Router) {
        this.loggedIn = this.authService.isLoggedIn;
        if (this.loggedIn) {
            this.userMail = this.authService.getUserMail();
        }
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.loggedIn = this.authService.isLoggedIn;
    }

    redirectToRegister() {
        this.authService.registerTriggered = true;
        this.router.navigate(['login']);
    }

    startEdit() {
        if (this.authService.isLoggedIn) {
            if (!this.editMode) {
                this.editMode = true;
            } else {
                // check if all fields are filled
                if (this.userPW == '' || this.userPW2 == '' || this.userOldPW == '') {
                    this.warningText = 'Please fill all fields.';
                    this.hasWarning = true;
                } else {
                    // check if new passwords are identical
                    if (this.userPW != this.userPW2) {
                        this.warningText = 'Passwords don´t match!';
                        this.hasWarning = true;
                    } else {
                        if (this.userPW.length < 6) {
                            this.warningText = 'Password must be at leat 6 characters long!'
                            this.hasWarning = true;
                        } else {
                            // check if old password is correct
                            if (!this.authService.checkPassword(this.userOldPW)) {
                                this.warningText = 'Old Password is wrong!';
                                this.hasWarning = true;
                            } else {
                                this.authService.changePassword(this.userPW);
                                this.editMode = false;
                            }
                        }

                    }
                }
            }
        }
    }

    deleteAccount() {
        this.authService.startDeleteUser();
    }


}
