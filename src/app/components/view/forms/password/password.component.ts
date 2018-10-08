import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { FormFieldComponent } from '../form-field.component';

/**
 * Custom password component, with ability to toggle showing or hiding the password in the input field.
 */
@Component({
  selector: 'es-password',
  templateUrl: './password.component.html',
})
export class PasswordComponent extends FormFieldComponent implements OnInit {

  /**
   * Whether the password field will display a Hide/show password link, defaults to true, so does not have to be passed in.
   */
  @Input() hasTogglePass?: boolean = true;

  /**
   * The field label, defaults to just Password, so does not have to be passed in.
   */
  @Input() label?: string = 'Password';

  /**
   * Message to display if password requires help text.
   */
  @Input() helpMessage?: string = '';

  /**
   * Message to display if field has a required validation error, has a default so does not need to be passed in.
   */
  @Input() requiredMessage?: string = 'Password is required';

  /**
   * Message to display if field has a min length validation error, has a default so does not need to be passed in.
   */
  @Input() minLengthMessage?: string = 'Password should be at least 8 characters';

  /**
   * Message to display if field has a pattern validation error, has a default so does not need to be passed in.
   */
  @Input() patternMessage?: string = 'Password to be mixed case with at least one number';

  /**
   * Message to display if field has a notEqualTo validation error.
   */
  @Input() notEqualMessage?: string;

  /**
   * Message to display if field has a equalTo validation error.
   */
  @Input() equalToMessage?: string;

  /**
   * Message to display if field is not null.
   */
  @Input() customErrorMessage?: string;

  /**
   * The value to use for the autocomplete attribute, has a default so does not have to be passed in.
   */
  @Input() autocomplete?: string = 'current-password';

  /**
   * Controls whether the password is shown in the input field, this is done by changing the input type between 'text' and 'password'.
   */
  showPassword = false;

  /**
   * Constructor, does nothing.
   */
  constructor() {
    super();
  }

  ngOnInit() {
    if (this.parentFormGroup === undefined || this.submitted === undefined || this.controlName === undefined) {
      throw new Error('Some required attributes were not passed in to the es-password component');
    }
  }

  /**
   * Toggles whether the password is to be shown or not.
   */
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Gets the FormControl for the password field this component represents.
   */
  get password(): AbstractControl {
    return this.parentFormGroup.get(this.controlName);
  }

}
