import { Component, Input, OnInit } from '@angular/core';
import { FormFieldComponent } from '../form-field.component';

/**
 * Custom postcode component.
 */
@Component({
  selector: 'es-postcode',
  templateUrl: './postcode.component.html',
})
export class PostcodeComponent extends FormFieldComponent implements OnInit {

  /**
   * The field label, defaults to just Postcode, so does not have to be passed in.
   */
  @Input() label?: string = 'Postcode';

  /**
   * Constructor, does nothing.
   */
  constructor() {
    super();
  }

  ngOnInit() {
    if (this.parentFormGroup === undefined || this.submitted === undefined || this.controlName === undefined) {
      throw new Error('Some required attributes were not passed in to the es-postcode component');
    }
  }

  /**
   * Gets the FormControl for the postcode field this component represents.
   */
  get postcode() {
    return this.parentFormGroup.get(this.controlName);
  }

}
