import { Component, OnInit } from '@angular/core';
import {ModuleService} from '../../services/module.service';
import {Router} from '@angular/router';
import { single } from './data';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  single: any[];
  view: any[] = [300, 300];

  // options
  gradient: boolean = false;
  showLegend: boolean = false;
  showLabels: boolean = false;
  isDoughnut: boolean = true;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#66bd92', '#cf5d5d', '#ffb763']
  };

  constructor() {
    Object.assign(this, { single });
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  constructor(private moduleService: ModuleService, private router: Router) { }
  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  restartLesson(){
    this.router.navigate(['learn-mode']);
  }

  ngOnInit(): void {
  }
}
