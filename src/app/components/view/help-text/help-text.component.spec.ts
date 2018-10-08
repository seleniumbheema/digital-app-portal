import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpTextComponent } from './help-text.component';

describe('HelpTextComponent', () => {
  let component: HelpTextComponent;
  let fixture: ComponentFixture<HelpTextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HelpTextComponent,
      ],
      providers: [],
      imports: [],
    });
    fixture = TestBed.createComponent(HelpTextComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('toggleHelpText should toggle the showHide status', () => {
    component.showHide = false;
    component.toggleHelpText();
    expect(component.showHide).toBeTrue();
  });
});
