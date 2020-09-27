import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImportModulesPage } from './import-modules.page';

describe('ImportModulesPage', () => {
  let component: ImportModulesPage;
  let fixture: ComponentFixture<ImportModulesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportModulesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImportModulesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
