import { Component, OnInit, Input } from '@angular/core';
import { FormFieldComponent } from '../form-field.component';

/**
 * Custom number screeningForm field component.
 */
@Component({
  selector: 'es-number-field',
  templateUrl: './number-field.component.html',
})
export class NumberFieldComponent extends FormFieldComponent implements OnInit {

  /**
   * The field label, defaults to just Number, so does not have to be passed in.
   */
  @Input() label?: string = '';

  /**
   * The maxlength, defaults to 6 so does not have to be passed in.
   */
  @Input() maxlength?: number = 6;

  /**
   * The value to use for the autocomplete attribute, has a default so does not have to be passed in.
   */
  @Input() autocomplete?: string = 'number';

  /**
   * The field is optional, pass in any required static string.
   */
  @Input() leftText?: string;

  /**
   * The field is optional, pass in any required static string.
   */
  @Input() rightText?: string;

  /**
   * Message to display if field has a required validation error, has a default so does not need to be passed in.
   */
  @Input() requiredMessage?: string =
    'We do need this information to progress. Please check you have entered the details correctly for us to continue';

  @Input() validationMessage?: string;

  /**
   * Constructor, does nothing.
   */
  constructor() {
    super();
  }

  ngOnInit() {
    if (this.parentFormGroup === undefined || this.submitted === undefined || this.controlName === undefined) {
      throw new Error('Some required attributes were not passed in to the es-number-field component');
    }
  }

  /**
   * Gets the FormControl for the number field this component represents.
   */
  get numberControl() {
    return this.parentFormGroup.get(this.controlName);
  }

}
