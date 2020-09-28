import { Injectable } from '@angular/core';
import {Statistic} from './statistic.model';
import {Session} from './session.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  session: Session;

  constructor() { }

  /**
   * Creates new learn mode session
   */
  createNewSession(){
    this.session = new Session();
  }
}
