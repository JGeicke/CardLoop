import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {AboutpagePage} from './aboutpage.page';

describe('AboutpagePage', () => {
    let component: AboutpagePage;
    let fixture: ComponentFixture<AboutpagePage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AboutpagePage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(AboutpagePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
