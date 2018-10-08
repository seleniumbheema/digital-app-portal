import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'es-global-messages',
  templateUrl: './global-messages.component.html',
})
export class GlobalMessagesComponent implements OnInit {

  @Input() messages: Message[];

  constructor() { }

  ngOnInit() {
  }

  hasMessages() {
    return this.messages && this.messages.length > 0;
  }

  closeMessage(index: number) {
    this.messages.splice(index, 1);
  }

}

/**
 * Interface to describe the properties a notification message should have.
 */
export interface Message {

  /** Severity, these match the class names of Bulma notifications, without the is- at the beginning. */
  severity: 'danger' | 'warning' | 'info' | 'success' | 'link' | 'primary';

  /** Heading of the message, this is optional. */
  heading?: string;

  /** The text of the message, this is optional. Can contain standard HTML code but not any Angular code. */
  summary?: string;

  /** Whether the message is closable. */
  closable: boolean;
}
