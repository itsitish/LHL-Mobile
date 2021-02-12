import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScenesPage } from './scenes.page';

describe('ScenesPage', () => {
  let component: ScenesPage;
  let fixture: ComponentFixture<ScenesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScenesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
