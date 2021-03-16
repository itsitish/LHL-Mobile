import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SceneAddPage } from './scene-add.page';

describe('SceneAddPage', () => {
  let component: SceneAddPage;
  let fixture: ComponentFixture<SceneAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SceneAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SceneAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
