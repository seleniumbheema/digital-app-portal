import { Component, Input, OnInit } from '@angular/core';
import { FormFieldComponent } from '../form-field.component';

/**
 * Custom first name component.
 */
@Component({
  selector: 'es-firstname',
  templateUrl: './firstname.component.html',
})
export class FirstnameComponent extends FormFieldComponent implements OnInit {

  /**
   * The field label, defaults or pass in a required label.
   */
  @Input() label?: string = 'What is your first name?';

  /**
   * The value to use for the autocomplete attribute, has a default so does not have to be passed in.
   */
  @Input() autocomplete?: string = 'given-name';

  /**
   * Constructor, does nothing.
   */
  constructor() {
    super();
  }

  ngOnInit() {
    if (this.parentFormGroup === undefined || this.submitted === undefined || this.controlName === undefined) {
      throw new Error('Some required attributes were not passed in to the es-firstname component');
    }
  }

  /**
   * Gets the FormControl for the first name field this component represents.
   */
  get firstname() {
    return this.parentFormGroup.get(this.controlName);
  }

}
