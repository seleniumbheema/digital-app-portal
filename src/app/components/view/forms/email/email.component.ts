import { Component, OnInit, Input } from '@angular/core';
import { FormFieldComponent } from '../form-field.component';

/**
 * Custom email component.
 */
@Component({
  selector: 'es-email',
  templateUrl: './email.component.html',
})
export class EmailComponent extends FormFieldComponent implements OnInit {

  /**
   * The field label, defaults to just Email address, so does not have to be passed in.
   */
  @Input() label?: string = 'Email address';

  /**
   * Message to display if field has a required validation error, has a default so does not need to be passed in.
   */
  @Input() requiredMessage?: string = 'Please enter a valid email address';

  /**
   * Message to display if field is not null.
   */
  @Input() customErrorMessage?: string;

  /**
   * The value to use for the autocomplete attribute, has a default so does not have to be passed in.
   */
  @Input() autocomplete?: string = 'username email';

  /**
   * Message to display if field has a equalTo validation error.
   */
  @Input() equalToMessage?: string;

  /**
   * Constructor, does nothing.
   */
  constructor() {
    super();
  }

  ngOnInit() {
    if (this.parentFormGroup === undefined || this.submitted === undefined || this.controlName === undefined) {
      throw new Error('Some required attributes were not passed in to the es-email component');
    }
  }

  /**
   * Gets the FormControl for the email field this component represents.
   */
  get email() {
    return this.parentFormGroup.get(this.controlName);
  }

}
