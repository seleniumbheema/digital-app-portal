import { FormGroup, FormControl, ValidatorFn, ValidationErrors, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import * as moment from 'moment';

import { NumberUtils } from '../utils/number-utils';
import { ReferenceKeyPair } from '../../routes/portal/policies/policy/policy-amendments/amendments.constants';

const NAMES_REGEX = '^[a-zA-Z-.\'\\s]+$';

const VEHICLE_REGISTRATION_REGEX = /^((\s*[0-9]{1}\s*[A-Z]{1}\s*)|(\s*[A-Z]){1,3}(\s*[0-9]){1,3}(\s*[A-Z]){0,3}\s*)$/i;

// This works for Northern Ireland reg's, but needs adapting to allow for spaces
// tslint:disable-next-line:max-line-length
// const VEHICLE_REGISTRATION_REGEX = /(^[A-Z]{2}[0-9]{2}[A-Z]{3}$)|(^[A-Z][0-9]{1,3}[A-Z]{3}$)|(^[A-Z]{3}[0-9]{1,3}[A-Z]$)|(^[0-9]{1,4}[A-Z]{1,2}$)|(^[0-9]{1,3}[A-Z]{1,3}$)|(^[A-Z]{1,2}[0-9]{1,4}$)|(^[A-Z]{1,3}[0-9]{1,3}$)|(^[A-Z]{1,3}[0-9]{1,4}$)/i;

/**
 * Contains information to be used to validate a date against the value of another date.
 * An example: Value of dateFormGroup passed in is 01/01/2018 and a duration of 1 year is passed in and beforeOrAfter set to after.
 * This means a date of 31/12/2017 is invalid, and a date of 02/01/2019 is invalid, anything inbetween is valid.
 *
 * @export
 * @interface ValidateAgainstDate
 */
export interface ValidateAgainstDate {
  dateFormGroup: FormGroup;
  dayKey: string;
  monthKey: string;
  yearKey: string;
  duration: {
    amount: moment.DurationInputArg1,
    unit: moment.DurationInputArg2,
  };
  /**
   * The specified duration will either be added to (if after) or subtracted from (if before) the dateFormGroup. If
   * after is passed in, the date must be greater than the dateFormGroup value, and less than the dateFormGroup value with
   * the duration added to it. If before is passed in, the date must be less than the dateFormGroup value, but more than the
   * dateFormGroup value with the duration subtracted from it.
   *
   * @type {('before' | 'after')}
   * @memberof ValidateAgainstDate
   */
  beforeOrAfter: 'before' | 'after';
}

export class ValidatorUtils {

  /**
   * Validates a date. Can validate against a min and max, as well as against the value of another form input date.
   *
   * @static
   * @param {string} dayKey
   * @param {string} monthKey
   * @param {string} yearKey
   * @param {moment.Moment} [maxDate]
   * @param {moment.Moment} [minDate]
   * @param {ValidateAgainstDate} [againstDate]
   * @returns {ValidatorFn}
   * @memberof ValidatorUtils
   */
  static validDate(
    dayKey: string, monthKey: string, yearKey: string, maxDate?: moment.Moment, minDate?: moment.Moment,
    againstDate?: ValidateAgainstDate): ValidatorFn {
    let subscribed: boolean = false;
    return (group: FormGroup): ValidationErrors | null => {
      // Initially set it up to return null, as returning null marks the screeningForm group as valid
      let returnObject = null;
      const day = group.controls[dayKey];
      const month = group.controls[monthKey];
      const year = group.controls[yearKey];

      // Only do extra validation if all 3 fields are themselves valid
      if (day.valid && month.valid && year.valid) {

        const dateStr = `${NumberUtils.pad(day.value, 2)}/` +
          `${NumberUtils.pad(month.value, 2)}/` +
          `${year.value}`;
        const momentDate = moment.utc(dateStr, 'DD/MM/YYYY', true);
        if (!momentDate.isValid()) {
          returnObject = {
            invalidDate: true,
          };
        } /* istanbul ignore next */ else if (maxDate && momentDate.isAfter(maxDate)) {
          returnObject = {
            dateAfter: true,
          };
        } else if (minDate && momentDate.isBefore(minDate)) {
          returnObject = {
            dateBefore: true,
          };
        } else if (againstDate) {
          if (!subscribed) {
            // Subscribe to changes on the other date form group to update the validity on this date group, only do this once
            subscribed = true;
            againstDate.dateFormGroup.valueChanges.subscribe(() => {
              group.updateValueAndValidity();
            });
          }

          if (againstDate.dateFormGroup.valid) {
            const againstDay = againstDate.dateFormGroup.controls[dayKey];
            const againstMonth = againstDate.dateFormGroup.controls[monthKey];
            const againstYear = againstDate.dateFormGroup.controls[yearKey];
            const againstDateStr = `${NumberUtils.pad(againstDay.value, 2)}/` +
              `${NumberUtils.pad(againstMonth.value, 2)}/` +
              `${againstYear.value}`;
            const againstMomentDate = moment.utc(againstDateStr, 'DD/MM/YYYY', true);
            const originalMomentDate = againstMomentDate.clone();

            /* istanbul ignore if */
            if (againstDate.beforeOrAfter === 'before') {
              againstMomentDate.subtract(againstDate.duration.amount, againstDate.duration.unit);
              if (momentDate.isBefore(againstMomentDate) || momentDate.isAfter(originalMomentDate)) {
                returnObject = {
                  dateInvalidAgainstOther: true,
                };
              }
            } else {
              againstMomentDate.add(againstDate.duration.amount, againstDate.duration.unit);
              if (momentDate.isAfter(againstMomentDate) || momentDate.isBefore(originalMomentDate)) {
                returnObject = {
                  dateInvalidAgainstOther: true,
                };
              }
            }
          }
        }
      } else {
        returnObject = {
          allFieldsNotValid: true,
        };
      }

      return returnObject;
    };
  }

  static validateDay(control: FormControl): ValidationErrors | null {
    return /^(0?[1-9]|[12][0-9]|3[01])$/.test(control.value) ? null : {
      validateDay: {
        valid: false,
      },
    };
  }

  static validateMonth(control: FormControl): ValidationErrors | null {
    return /^(0?[1-9]|1[012])$/.test(control.value) ? null : {
      validateMonth: {
        valid: false,
      },
    };
  }

  static validateYear(control: FormControl): ValidationErrors | null {
    return /^(19|20)[0-9]{2}$/.test(control.value) ? null : {
      validateYear: {
        valid: false,
      },
    };
  }

  /**
   * Checks the value exists in the allowed array.
   *
   * @static
   * @param {ReferenceKeyPair[]} allowedArray
   * @param {string} [prop='code'] which property to validate against, defaults to code, but could be label if passed in
   * @returns {ValidatorFn}
   * @memberof ValidatorUtils
   */
  /* istanbul ignore next */
  static validateValueIsInAllowedArray(allowedArray: ReferenceKeyPair[], prop: 'code' | 'label' = 'code'): ValidatorFn {
    return (control: FormControl): ValidationErrors | null => {
      const valid = allowedArray.some((element: ReferenceKeyPair) => element[prop] === control.value);
      return valid ? null : {
        invalidValue: true,
      };
    };
  }

  static getVehicleRegistrationValidators(): ValidatorFn[] {
    return [Validators.required, CustomValidators.rangeLength([2, 8]), Validators.pattern(VEHICLE_REGISTRATION_REGEX)];
  }

  static getFirstNameValidators(): ValidatorFn[] {
    return [Validators.required, Validators.pattern(NAMES_REGEX), CustomValidators.rangeLength([2, 40])];
  }

  static getLastNameValidators(): ValidatorFn[] {
    return [Validators.required, Validators.pattern(NAMES_REGEX), CustomValidators.rangeLength([2, 40])];
  }

  static validateValue(control: FormControl) {
    const regex = /^\£?[0-9]+(,[0-9]+)?(\.[0-9]{1,2})?$/;

    return regex.test(control.value) ? null : {
      validateValue: {
        valid: false,
      },
    };
  }

  /**
   * Gets the date validators to use for a day, month, or year form field. It assumes that the key names they have been given in the FormGroup is
   * Day, Month and Year.
   *
   * @static
   * @param {string} controlName
   * @returns {ValidatorFn[]}
   * @memberof ValidatorUtils
   */
  static getDateFieldValidators(controlName: string): ValidatorFn[] {
    switch (controlName) {
      case 'Day':
        return [Validators.required, ValidatorUtils.validateDay];
      case 'Month':
        return [Validators.required, ValidatorUtils.validateMonth];
      case 'Year':
        return [Validators.required, ValidatorUtils.validateYear];
      default:
        console.warn('Unexpected control name passed:', controlName);
        return null;
    }
  }

  constructor() {
    throw new Error('ValidatorUtils class cannot be instantiated');
  }

}
