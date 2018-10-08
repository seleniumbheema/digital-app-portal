import { Component, Input, OnInit } from '@angular/core';
import { FormFieldComponent } from '../form-field.component';
import { CompleterData } from 'ng2-completer';
import { AbstractControl } from '@angular/forms';

/**
 * Custom autocomplete component.
 */
@Component({
  selector: 'es-autocomplete',
  templateUrl: './autocomplete-field.component.html',
})
export class AutocompleteFieldComponent extends FormFieldComponent implements OnInit {

  /**
   * The data to perform autocomplete on.
   *
   * @type {CompleterData}
   * @memberof AutocompleteFieldComponent
   */
  @Input() controlArray: CompleterData;

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
   * Minimum number of characters to initiate a search.
   *
   * @type {number}
   * @memberof AutocompleteFieldComponent
   */
  @Input() minLength?: number = 3;

  /**
   * We maintain our own state of touched, because there is a bug with the autocomplete input where it gets set as touched as soon as clicked into.
   *
   * @type {boolean}
   * @memberof AutocompleteFieldComponent
   */
  public touched: boolean = false;

  /**
   * Constructor, does nothing.
   */
  constructor() {
    super();
  }

  ngOnInit() {
    if (this.parentFormGroup === undefined || this.submitted === undefined || this.controlName === undefined || this.controlArray === undefined) {
      throw new Error('Some required attributes were not passed in to the es-autocomplete component');
    }
  }

  /**
   * Gets the FormControl for the autocomplete field this component represents.
   */
  get autocompleteControl(): AbstractControl {
    return this.parentFormGroup.get(this.controlName);
  }
}
