import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferComponent } from './offer.component';

describe('OfferComponent', () => {
  let component: OfferComponent;
  let fixture: ComponentFixture<OfferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        OfferComponent,
      ],
      providers: [],
      imports: [],
    });
    fixture = TestBed.createComponent(OfferComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not set icon if offer class does not match any expected classes', () => {
    component.offer = {
      class: 'unknown',
      heading: '',
      content: '',
      url: '',
      info: '',
      enabled: false,
    };
    component.setOfferIcon();
    expect(component.icon).toBeUndefined();
  });
});
