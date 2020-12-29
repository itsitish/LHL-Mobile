import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MultipleModePage } from './multiple-mode.page';

describe('MultipleModePage', () => {
  let component: MultipleModePage;
  let fixture: ComponentFixture<MultipleModePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleModePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleModePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
