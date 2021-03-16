import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddTimePage } from './add-time.page';

describe('AddTimePage', () => {
  let component: AddTimePage;
  let fixture: ComponentFixture<AddTimePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTimePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
