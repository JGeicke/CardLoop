import { Injectable } from '@angular/core';
import {AlertController} from '@ionic/angular';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  public currLesson;
  public lessons = [];
  private lesson = {name: 'Compilerbau', cards: 42, tags: ['Programming', 'Computer Science', 'Something more']};
  imported = false;

  constructor(private alertController: AlertController) {
    for (let i = 0; i < 5; i++) {
      this.lessons.push(this.lesson);
    }
  }

  lessonDetails(id) {
    console.log(id);
  }

  importLesson(id) {
    // Idee: FindLessonById aufrufen und schauen, ob die Lesson bereits importiert ist.
    // Das imported ist nur zum testen und kann dann ersetzt werden.
    if (this.imported === false) {
      console.log('importlesson called');
      this.imported = !this.imported;
    }
  }

  async delDialog() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Please confirm!',
      message: '<p>This item will and all associated ' +
          'data will be deleted. This action cannot be undone. </p>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.deleteLesson(this.currLesson);
            this.alertController.dismiss({
              dismissed: true
            });
          }
        }
      ]
    });

    await alert.present();
  }

  deleteLesson(currLesson) {
    console.log(currLesson);
  }
}
