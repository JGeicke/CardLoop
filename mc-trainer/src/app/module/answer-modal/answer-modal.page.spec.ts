import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnswerModalPage } from './answer-modal.page';

describe('AnswerModalPage', () => {
  let component: AnswerModalPage;
  let fixture: ComponentFixture<AnswerModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnswerModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
