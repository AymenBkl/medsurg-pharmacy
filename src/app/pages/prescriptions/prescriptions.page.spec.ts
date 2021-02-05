import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrescriptionsPage } from './prescriptions.page';

describe('PrescriptionsPage', () => {
  let component: PrescriptionsPage;
  let fixture: ComponentFixture<PrescriptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrescriptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
