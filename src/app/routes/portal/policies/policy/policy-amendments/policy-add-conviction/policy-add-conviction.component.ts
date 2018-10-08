import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import * as moment from 'moment';

import { convictionCodeArray } from '../amendments.constants';
import { ValidatorUtils } from '../../../../../../components/utils/validator-utils';
import { MtaService } from '../../../../../../components/services/mta.service';
import { LoadingHandlerComponent } from '../../../../../../components/shared/loading-handler.component';
import { MotorPolicyDetails } from '../../../../../../models/policy/motor-details';
import { HttpErrorModel } from '../../../../../../components/services/http.service';
import { Message } from '../../../../../../components/view/global-messages/global-messages.component';
import { NumberUtils } from '../../../../../../components/utils/number-utils';

interface ConvictionDetails {
  relatesTo: string;
  namedDriverFirstName?: string;
  namedDriverLastName?: string;
  convictionCode: string;
  dateOfConviction: string;
  penaltyPoints: string;
}

@Component({
  templateUrl: './policy-add-conviction.component.html',
})
export class PolicyAddConvictionComponent extends LoadingHandlerComponent implements OnInit {

  public policy: MotorPolicyDetails;
  public phoneNumbers: BrandPhoneNumbers = ESURE_GLOBALS.BRAND_CONFIG.phoneNumbers;
  public messages: Message[] = [];

  public convictionDetails: ConvictionDetails;

  public dateFormGroup: FormGroup;

  public convictionForm: FormGroup;
  public convictionFormSubmitted: boolean = false;
  public disableSubmit: boolean = false; // set to true during login attempt (stops resending form)
  public convictionFormSent: boolean;
  public convictionCodes: any;

  public relatedCtrl: FormControl;
  public namedFirstNameCtrl: FormControl;
  public namedSurnameCtrl: FormControl;
  public suspendedCtrl: FormControl;
  public manyConvictionsCtrl: FormControl;
  public convictCodeCtrl: FormControl;
  public penaltyPointsCtrl: FormControl;

  private maxConvictionDate = moment.utc().endOf('day');
  private minConvictionDate = moment.utc().subtract(1, 'year');

  constructor(
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public mtaService: MtaService) {
    super();
  }

  ngOnInit() {
    this.route.parent.parent.data.subscribe((data: any) => {
      this.policy = data.policy;
      this.convictionCodes = convictionCodeArray;

      this.initConvictionForm();
      this.handlePolicyHolderOrNamedChange();
    });
  }

  private initConvictionForm(): void {
    this.dateFormGroup = this.formBuilder.group(
      {
        Day: ['', [
          Validators.required,
          ValidatorUtils.validateDay,
        ]],
        Month: ['', [
          Validators.required,
          ValidatorUtils.validateMonth,
        ]],
        Year: ['', [
          Validators.required,
          ValidatorUtils.validateYear,
        ]],
      },
      {
        validator: ValidatorUtils.validDate('Day', 'Month', 'Year', this.maxConvictionDate, this.minConvictionDate),
      },
    );

    this.relatedCtrl = new FormControl('', Validators.required);
    this.namedFirstNameCtrl = new FormControl('', ValidatorUtils.getFirstNameValidators());
    this.namedSurnameCtrl = new FormControl('', ValidatorUtils.getLastNameValidators());
    this.suspendedCtrl = new FormControl('', Validators.required);
    this.manyConvictionsCtrl = new FormControl('', Validators.required);
    this.convictCodeCtrl = new FormControl('', Validators.required);
    this.penaltyPointsCtrl = new FormControl('', [Validators.required, CustomValidators.range([1, 11])]);

    this.convictionForm = this.formBuilder.group({
      relatesTo: this.relatedCtrl,
      namedDriverFirstName: this.namedFirstNameCtrl,
      namedDriverLastName: this.namedSurnameCtrl,
      licenceSuspended: this.suspendedCtrl,
      moreThanOneConviction: this.manyConvictionsCtrl,
      convictionCode: this.convictCodeCtrl,
      dateOfConviction: this.dateFormGroup,
      penaltyPoints: this.penaltyPointsCtrl,
    });
  }

  /***
   * Click handler for updating the validators when policy holder or named driver radios are clicked.
   * Also called on init of component to correctly remove any validators if form is already pre populated with a chosen option.
   */
  public handlePolicyHolderOrNamedChange(): void {
    /* istanbul ignore next */
    if (this.relatedCtrl.valid) {
      const chosenOption = this.relatedCtrl.value;
      if (chosenOption === 'ME') {
        // Clear validators on named driver fields
        this.namedFirstNameCtrl.clearValidators();
        this.namedSurnameCtrl.clearValidators();
        // reset validation issues
        this.convictionFormSubmitted = false;
      } else {
        // Re apply validators to named driver fields
        this.namedFirstNameCtrl.setValidators(ValidatorUtils.getFirstNameValidators());
        this.namedSurnameCtrl.setValidators(ValidatorUtils.getLastNameValidators());
        // reset validation issues
        this.convictionFormSubmitted = false;
      }
      // Tell Angular we've made updates to both form fields
      this.namedFirstNameCtrl.updateValueAndValidity();
      this.namedSurnameCtrl.updateValueAndValidity();
    }
  }

  public submitChanges(): void {
    // Clear any messages
    this.messages = [];

    if (this.convictionForm.valid && !this.disableSubmit) {
      this.disableSubmit = true;
      this.showLoader();

      const formattedConvictionDate =
        [this.dateFormGroup.value.Year, NumberUtils.pad(this.dateFormGroup.value.Month, 2),
        NumberUtils.pad(this.dateFormGroup.value.Day, 2)].join('-').toString();
      const requiredConvictionDateFormat = moment.utc(formattedConvictionDate).format('DD-MM-YYYY');

      this.convictionDetails = {
        relatesTo: this.relatedCtrl.value,
        ...this.relatedCtrl.value === 'OTHER' && {
          namedDriverFirstName: this.namedFirstNameCtrl.value.trim(),
          namedDriverLastName: this.namedSurnameCtrl.value.trim(),
        },
        convictionCode: this.convictCodeCtrl.value,
        dateOfConviction: requiredConvictionDateFormat,
        penaltyPoints: this.penaltyPointsCtrl.value,
      };

      this.mtaService.postConvictionChange(this.policy, this.convictionDetails).subscribe(
        () => {
          this.convictionFormSent = true;
          this.disableSubmit = false;
          this.hideLoader();
          this.backToTop();
        },
        (error: HttpErrorModel) => {
          console.debug('Error submitting conviction changes: ', error);
          this.messages.push({ severity: 'danger', closable: false, summary: 'Unable to process form. Please try again.', heading: '' });
          this.hideLoader();
          this.scrollToGlobalFormError();
          this.disableSubmit = false;
        });

    } else {
      this.convictionFormSubmitted = true;
    }
  }
}
