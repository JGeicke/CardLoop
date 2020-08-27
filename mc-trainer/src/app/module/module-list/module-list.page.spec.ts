import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModuleListPage } from './module-list.page';

describe('ModuleListPage', () => {
  let component: ModuleListPage;
  let fixture: ComponentFixture<ModuleListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModuleListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
