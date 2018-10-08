import { Component, Input, OnInit } from '@angular/core';
import { FormFieldComponent } from '../form-field.component';

/**
 * Custom select component.
 */
@Component({
  selector: 'es-select',
  templateUrl: './select-field.component.html',
})
export class SelectFieldComponent extends FormFieldComponent implements OnInit {

  /**
   * The field label, defaults to empty, pass in a required label.
   */
  @Input() label?: string;

  /**
   * The field is optional, pass in any required static string.
   */
  @Input() leftText?: string;

  /**
   * The field is optional, pass in any required static string.
   */
  @Input() rightText?: string;

  /**
   * The field is optional, pass in any array of key value pairs.
   */
  @Input() controlArray?: any[];

  /**
   * The field is optional, pass in any array of strings.
   */
  @Input() controlString?: string[];

  /**
   * Constructor, does nothing.
   */
  constructor() {
    super();
  }

  ngOnInit() {
    if (this.parentFormGroup === undefined || this.submitted === undefined || this.controlName === undefined) {
      throw new Error('Some required attributes were not passed in to the es-select component');
    }
  }

  /**
   * Gets the FormControl for the text field this component represents.
   */
  get selectcontent() {
    return this.parentFormGroup.get(this.controlName);
  }

}
