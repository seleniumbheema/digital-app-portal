import { Component, Input } from '@angular/core';
@Component({
  selector: 'es-help-text',
  templateUrl: 'help-text.component.html',
  host: { class: 'column is-12' },
})
export class HelpTextComponent {

  public showHide: boolean;

  /**
   * The help icon, defaults to false.
   */
  @Input() helpIcon?: boolean = false;

  /**
   * Shows or hides the help text by reversing it's current showHide status.
   *
   * @memberof HelpTextComponent
   */
  public toggleHelpText(): void {
    this.showHide = !this.showHide;
  }
}
