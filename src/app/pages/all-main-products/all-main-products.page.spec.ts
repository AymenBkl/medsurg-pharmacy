import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllMainProductsPage } from './all-main-products.page';

describe('AllMainProductsPage', () => {
  let component: AllMainProductsPage;
  let fixture: ComponentFixture<AllMainProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllMainProductsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllMainProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
