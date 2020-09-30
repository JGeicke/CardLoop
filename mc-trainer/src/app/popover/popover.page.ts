import {Component, Input, OnInit} from '@angular/core';
import { ModuleService } from '../../services/module.service';
import {Module} from "../../services/module.model";
import {PopoverController} from "@ionic/angular";
@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {

  constructor(private moduleService: ModuleService, public popoverController: PopoverController) { }

  ngOnInit() {
  }

    // dismissPopover() {
    //     if (currentPopover) {
    //         currentPopover.dismiss().then(() => { currentPopover = null; });
    //     }
    // }

}
