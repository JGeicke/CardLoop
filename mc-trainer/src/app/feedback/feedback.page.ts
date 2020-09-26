import { Component, OnInit } from '@angular/core';
import { single } from './data';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  single: any[];
  view: any[] = [700, 400];

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

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  ngOnInit(): void {
  }
}
