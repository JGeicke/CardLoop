import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LearnModePage } from './learn-mode.page';

describe('LearnModePage', () => {
  let component: LearnModePage;
  let fixture: ComponentFixture<LearnModePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnModePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LearnModePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
