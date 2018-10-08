import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspendedComponent } from './suspended.component';
import { TestModule } from '../../../../../../test-helpers';

describe('SuspendedComponent', () => {
  let component: SuspendedComponent;
  let fixture: ComponentFixture<SuspendedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SuspendedComponent,
      ],
      imports: [
        TestModule,
      ],
      providers: [
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspendedComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
