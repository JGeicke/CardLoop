import {Component, Input, OnInit} from '@angular/core';
import { ModuleService } from '../../services/module.service';
import {Module} from "../../services/module.model";
@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {

  constructor(private moduleService: ModuleService) { }

  ngOnInit() {
  }

}
