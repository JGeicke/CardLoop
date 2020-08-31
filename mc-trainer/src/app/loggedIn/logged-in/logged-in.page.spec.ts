import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoggedInPage } from './logged-in.page';

describe('LoggedInPage', () => {
  let component: LoggedInPage;
  let fixture: ComponentFixture<LoggedInPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoggedInPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoggedInPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
