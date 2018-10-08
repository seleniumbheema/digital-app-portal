import { Component, Input, OnInit } from '@angular/core';
import { FormFieldComponent } from '../form-field.component';

/**
 * Custom last name component.
 */
@Component({
  selector: 'es-lastname',
  templateUrl: './lastname.component.html',
})
export class LastnameComponent extends FormFieldComponent implements OnInit {

  /**
   * The field label, defaults or pass in a required label.
   */
  @Input() label?: string = 'What is your last name?';

  /**
   * The value to use for the autocomplete attribute, has a default so does not have to be passed in.
   */
  @Input() autocomplete?: string = 'family-name';

  /**
   * Constructor, does nothing.
   */
  constructor() {
    super();
  }

  ngOnInit() {
    if (this.parentFormGroup === undefined || this.submitted === undefined || this.controlName === undefined) {
      throw new Error('Some required attributes were not passed in to the es-lastname component');
    }
  }

  /**
   * Gets the FormControl for the last name field this component represents.
   */
  get lastname() {
    return this.parentFormGroup.get(this.controlName);
  }

}
