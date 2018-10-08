import { Component, OnInit, Input } from '@angular/core';

import { FormFieldComponent } from '../form-field.component';
import { AbstractControl } from '@angular/forms';

/**
 * Custom date component.
 */
@Component({
  selector: 'es-date-field',
  templateUrl: './date.component.html',
})
export class DateComponent extends FormFieldComponent implements OnInit {

  /**
   * The field label, defaults to just Date, so does not have to be passed in.
   */
  @Input() label?: string = 'Date';

  @Input() helpText?: string;

  public dayControlName: string;
  public monthControlName: string;
  public yearControlName: string;

  /**
   * The field is optional, pass in any required static string.
   */
  @Input() leftText?: string;

  /**
   * The field is optional, pass in any required static string.
   */
  @Input() rightText?: string;

  /**
   * The value to use as part of the autocomplete attribute, has a default that is applicable for date of birth fields
   * so does not have to be passed in.
   * day, month, and year will be appended for each of the 3 fields, e.g bday-day, bday-month and bday-year
   */
  @Input() autocomplete?: string = 'bday';

  /**
   * The value to prepend infront of each fields control name to make the input ID. Needed for when multiple date components
   * are on the same page and so the inputs need to all have unique IDs.
   *
   * @type {string}
   * @memberof DateComponent
   */
  @Input() prependInputId?: string = 'date';

  /**
   * Default required message.
   *
   * @type {string}
   * @memberof DateComponent
   */
  @Input() requiredMessage?: string = `We do need this information to progress.
    Please check you have entered the details correctly for us to continue.`;

  /**
   * Message to display if validation failed on comparing to another date.
   *
   * @type {string}
   * @memberof DateComponent
   */
  @Input() compareToOtherDateMessage?: string;

  /**
   * Message to display if validations fails min date.
   *
   * @type {string}
   * @memberof DateComponent
   */
  @Input() minMessage?: string;

  /**
   * Message to display if validations fails max date.
   *
   * @type {string}
   * @memberof DateComponent
   */
  @Input() maxMessage?: string;

  /**
   * Constructor, does nothing.
   */
  constructor() {
    super();
  }

  ngOnInit() {
    if (this.parentFormGroup === undefined || this.submitted === undefined || this.controlName === undefined) {
      throw new Error('Some required attributes were not passed in to the es-date-field component');
    }

    const fieldNames = this.controlName.split('-');
    this.dayControlName = fieldNames[0];
    this.monthControlName = fieldNames[1];
    this.yearControlName = fieldNames[2];
  }

  /**
   * Whether to show date field errors.
   * Shown if the form group is invalid and the day and month fields entered in and clicked out of,
   * and the year field has at least one character,
   * or if any field is invalid and has been entered into and clicked out of.
   * @return {boolean} true if the errors should be shown
   */
  public isShowErrorMessage() {
    const groupInvalidAndAllFieldsTouched = !this.parentFormGroup.valid && this.getDayControl().dirty
      && this.getDayControl().touched && this.getMonthControl().dirty &&
      this.getMonthControl().touched && this.getYearControl().dirty;
    return groupInvalidAndAllFieldsTouched
      || (!this.getDayControl().valid && this.getDayControl().dirty && this.getDayControl().touched)
      || (!this.getMonthControl().valid && this.getMonthControl().dirty && this.getMonthControl().touched)
      || (!this.getYearControl().valid && this.getYearControl().dirty);
  }

  /**
   * Whether the is-danger class should be added to the form field, for now shares the same logic for whether the error message is shown.
   */
  public isDangerClassActive() {
    return this.isShowErrorMessage();
  }

  private getDayControl(): AbstractControl {
    return this.parentFormGroup.get(this.dayControlName);
  }

  private getMonthControl(): AbstractControl {
    return this.parentFormGroup.get(this.monthControlName);
  }

  private getYearControl(): AbstractControl {
    return this.parentFormGroup.get(this.yearControlName);
  }

}
