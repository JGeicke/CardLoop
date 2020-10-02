import { Injectable } from '@angular/core';
import {Statistic} from './statistic.model';
import {Session} from './session.model';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  session: Session;
  userStats: Statistic;

  constructor(private firestore: AngularFirestore) { }

  /**
   * Creates new learn mode session
   */
  createNewSession(){
    this.session = new Session();
  }

  /**
   * Initializes user document in userStats collection
   * @param uid - UID of registered user
   */
  initUserStats(uid: string){
    return this.firestore.collection('userStats').doc(uid).set({
      averageSessionTime: 0,
      lessonCount: 0,
      questionCount: 0,
      correctQuestionCount: 0,
      registrationDate: firebase.firestore.Timestamp.fromDate(new Date())
    });
  }

  /**
   * Get User stats from the user document in the userStats collection in Cloud Firestore
   * @param uid UID of logged-in User
   */
  getUserStats(uid: string){
    return this.firestore.collection('userStats').doc(uid).get().toPromise().then((res) => {
      if (res.exists){
        this.userStats = new Statistic(res.data().averageSessionTime, res.data().lessonCount,
            res.data().questionCount, res.data().correctQuestionCount, res.data().registrationDate.toDate());
      }
    });
  }

  generateUserStats(uid: string, session: Session){
    this.userStats.incrementLessonCount();
    this.userStats.increaseQuestionCount(session.getQuestionCount());
    this.userStats.increaseCorrectQuestionCount(session.getCorrectQuestionCount());
    this.userStats.calcAverageSessionTime(session.getStartTimestamp(), session.getEndTimestamp());
    this.updateUserStats(uid);
  }

  updateUserStats(uid: string){
    return this.firestore.collection('userStats').doc(uid).update({
      averageSessionTime: this.userStats.averageSessionTime,
      correctQuestionCount: this.userStats.correctQuestionCount,
      lessonCount: this.userStats.lessonCount,
      questionCount: this.userStats.questionCount
    });
  }

}
