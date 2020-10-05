import {Component, OnInit} from '@angular/core';
import {NavController} from "@ionic/angular";

@Component({
    selector: 'app-aboutpage',
    templateUrl: './aboutpage.page.html',
    styleUrls: ['./aboutpage.page.scss'],
})
export class AboutpagePage implements OnInit {

    constructor(private navCtrl: NavController) {
    }

    ngOnInit() {
    }

}
