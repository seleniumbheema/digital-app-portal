import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalMessagesComponent, Message } from './global-messages.component';

describe('GlobalMessagesComponent', () => {

  const message: Message = { severity: 'danger', closable: true };
  let component: GlobalMessagesComponent;
  let fixture: ComponentFixture<GlobalMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GlobalMessagesComponent,
      ],
      providers: [],
      imports: [
      ],
    });

    fixture = TestBed.createComponent(GlobalMessagesComponent);
    component = fixture.componentInstance;
    component.messages = [];
    fixture.detectChanges();
  });

  describe('Messages', () => {

    it('should return false from hasMessages() if no messages', () => {
      expect(component.hasMessages()).toBeFalse();
    });

    it('should return true from hasMessages() if has messages', () => {
      component.messages.push(message);
      expect(component.hasMessages()).toBeTrue();
    });

    it('should remove a message when closeMessage() is called', () => {
      component.messages.push(message);
      expect(component.hasMessages()).toBeTrue();
      component.closeMessage(0);
      expect(component.hasMessages()).toBeFalse();
    });

    it('should leave messages untouched when closeMessage() is called with an invalid index', () => {
      component.messages.push(message);
      expect(component.hasMessages()).toBeTrue();
      component.closeMessage(1);
      expect(component.hasMessages()).toBeTrue();
    });
  });
});
