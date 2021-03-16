import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AutomationPage } from './automation.page';

describe('AutomationPage', () => {
  let component: AutomationPage;
  let fixture: ComponentFixture<AutomationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutomationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AutomationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
