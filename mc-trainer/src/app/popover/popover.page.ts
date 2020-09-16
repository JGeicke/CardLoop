import { Component, OnInit } from '@angular/core';
import { ModuleService } from '../../services/module.service';
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
