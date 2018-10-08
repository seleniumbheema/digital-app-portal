import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { FormFieldComponent } from '../form-field.component';

/**
 * Custom select component.
 */
@Component({
  selector: 'es-radio',
  templateUrl: './radio-btn.component.html',
})
export class RadioBtnComponent extends FormFieldComponent implements OnInit {

  /**
   * The field label, defaults to empty, pass in a required label.
   */
  @Input() label?: string;

  /**
   * The field sets affirmative id.
   */
  @Input() affirmative: string;

  /**
   * This sets the affirmative label, defaults to yes.
   */
  @Input() affirmativeLabel: string = 'Yes';

  /**
   * This sets the affirmative label, defaults to Y.
   */
  @Input() affirmativeValue: string = 'Y';

  /**
   * The field sets negative id.
   */
  @Input() negative: string;

  /**
   * This sets the affirmative label, defaults to no.
   */
  @Input() negativeLabel: string = 'No';

  /**
   * This sets the affirmative label, defaults to N.
   */
  @Input() negativeValue: string = 'N';

  /**
   * This sets the affirmative label, defaults to N.
   */
  @Input() longLabels: boolean = false;

  /**
   * The field is optional, pass in any required static string.
   */
  @Input() leftText?: string;

  /**
   * The field is optional, pass in any required static string.
   */
  @Input() rightText?: string;

  /**
   * Constructor, does nothing.
   */
  constructor() {
    super();
  }

  ngOnInit() {
    if (this.parentFormGroup === undefined || this.submitted === undefined || this.controlName === undefined) {
      throw new Error('Some required attributes were not passed in to the es-radio component');
    }
  }

  /**
   * Gets the FormControl for the radio button fields this component represents.
   */
  get radioControl(): AbstractControl {
    return this.parentFormGroup.get(this.controlName);
  }

}
