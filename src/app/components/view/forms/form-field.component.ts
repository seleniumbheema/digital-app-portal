import { EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

/**
 * Any custom form field components should extend this one.
 */
export abstract class FormFieldComponent {

  /**
   * The parent form group, this is a required attribute to be passed in.
   */
  @Input() parentFormGroup: FormGroup;

  /**
   * The submitted status of the form, this is a required attribute to be passed in.
   */
  @Input() submitted: boolean;

  /**
   * Output the event thats clicked.
   */
  @Output() emitClickIcon = new EventEmitter();

  /**
   * The form control name, this is a required attribute to be passed in.
   * If the component contains multiple input fields, for example the DateComponent, then all the field control names
   * should be passed in separated by a hyphen.
   */
  @Input() controlName: string;

  /**
   * Emit event via Angular Output.
   *
   * @memberof FormFieldComponent
   */
  public clickedIcon(): void {
    this.emitClickIcon.emit();
  }

}
