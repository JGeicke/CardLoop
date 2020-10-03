import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddModulesPage } from './add-modules.page';

describe('AddModulesPage', () => {
  let component: AddModulesPage;
  let fixture: ComponentFixture<AddModulesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddModulesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddModulesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
