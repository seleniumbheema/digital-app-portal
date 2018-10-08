import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { CompleterData, CompleterService } from 'ng2-completer';
import * as moment from 'moment';

import * as amendmentsConstants from '../amendments.constants';
import { ValidatorUtils, ValidateAgainstDate } from '../../../../../../components/utils/validator-utils';
import { MtaService } from '../../../../../../components/services/mta.service';
import { LoadingHandlerComponent } from '../../../../../../components/shared/loading-handler.component';
import { MotorPolicyDetails } from '../../../../../../models/policy/motor-details';
import { HttpErrorModel } from '../../../../../../components/services/http.service';
import { Message } from '../../../../../../components/view/global-messages/global-messages.component';

const licenceYearsNeedingMonths: Set<string> = new Set().add('1 Years').add('2 Years').add('3 Years').add('4 Years').add('5 Years');

const employmentStatusNeedingOccupation: Set<string> = new Set().add('Employed').add('Self employed');

@Component({
  templateUrl: './add-driver.component.html',
})
export class AddDriverComponent extends LoadingHandlerComponent implements OnInit {

  public policy: MotorPolicyDetails;
  public phoneNumbers: BrandPhoneNumbers = ESURE_GLOBALS.BRAND_CONFIG.phoneNumbers;
  public messages: Message[] = [];
  public refKeyLists = amendmentsConstants;

  public disableSubmit: boolean = false; // set to true during driver details form submission (stops resending form)
  public screeningForm: FormGroup;
  public dateFromGroup: FormGroup;
  public dateUntilGroup: FormGroup;
  public dateOfBirthGroup: FormGroup;
  public screeningFormSubmitted: boolean = false;
  public showAddDriverForm: boolean = false;

  public driverDetailsForm: FormGroup;
  public driverDetailsFormSubmitted: boolean = false;
  public changeFormSent: boolean;

  public occupationsArray: CompleterData;
  public industryArray: CompleterData;

  private maxDob = moment.utc().subtract(16, 'years');

  private minFromDate = moment.utc().add(1, 'day').startOf('day');
  private maxFromDate: moment.Moment;

  constructor(
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public mtaService: MtaService,
    public completerService: CompleterService,
  ) {
    super();
    this.occupationsArray = this.completerService.local(this.refKeyLists.occupationsArray, 'label', 'label');
    this.industryArray = this.completerService.local(this.refKeyLists.industryArray, 'label', 'label');
  }

  ngOnInit(): void {
    this.route.parent.parent.data.subscribe((data: Data) => {
      this.policy = data.policy;
      // const policyStartDate = moment.utc(this.policy.startDate).startOf('day');
      // console.log('policy start date is:', policyStartDate);
      // console.log('min from date is', this.minFromDate);
      // console.log('policy is:', this.policy);
      // if (policyStartDate.isAfter(this.minFromDate)) {
      //   this.minFromDate = policyStartDate;
      // }
      this.maxFromDate = moment.utc(this.policy.renewalDate);

      this.initScreeningForm();
      this.initDriverDetailsForm();
    });
  }

  private initScreeningForm(): void {

    this.dateFromGroup = this.formBuilder.group(
      {
        Day: new FormControl('', ValidatorUtils.getDateFieldValidators('Day')),
        Month: new FormControl('', ValidatorUtils.getDateFieldValidators('Month')),
        Year: new FormControl('', ValidatorUtils.getDateFieldValidators('Year')),
      },
      {
        validator: this.getDateFromValidator(),
      },
    );

    this.dateUntilGroup = this.formBuilder.group(
      {
        Day: new FormControl('', ValidatorUtils.getDateFieldValidators('Day')),
        Month: new FormControl('', ValidatorUtils.getDateFieldValidators('Month')),
        Year: new FormControl('', ValidatorUtils.getDateFieldValidators('Year')),
      },
      {
        validator: this.getDateUntilValidator(),
      },
    );

    this.screeningForm = this.formBuilder.group({
      typeOfCover: new FormControl('', [Validators.required, Validators.pattern('^[P|T]$')]),
      twoDriversAlready: new FormControl('', this.getRequiredValidator()),
      confirmAgree: new FormControl('', [Validators.required, Validators.pattern('^[Y|N]$')]),
      dateFrom: this.dateFromGroup,
      dateUntil: this.dateUntilGroup,
    });
  }

  /**
   * Get the required validator.
   * @return required validator function
   */
  private getRequiredValidator(): ValidatorFn {
    return Validators.required;
  }

  private getDateFromValidator(): ValidatorFn {
    return ValidatorUtils.validDate('Day', 'Month', 'Year', this.maxFromDate, this.minFromDate);
  }

  private getDateUntilValidator(): ValidatorFn {
    const againstDate: ValidateAgainstDate = {
      dateFormGroup: this.dateFromGroup,
      dayKey: 'Day',
      monthKey: 'Month',
      yearKey: 'Year',
      duration: {
        amount: 7,
        unit: 'weeks',
      },
      beforeOrAfter: 'after',
    };
    return ValidatorUtils.validDate('Day', 'Month', 'Year', this.maxFromDate, this.minFromDate, againstDate);
  }

  private getOccupationValidators(): ValidatorFn[] {
    return [Validators.required, ValidatorUtils.validateValueIsInAllowedArray(this.refKeyLists.occupationsArray, 'label')];
  }

  private getIndustryValidators(): ValidatorFn[] {
    return [Validators.required, ValidatorUtils.validateValueIsInAllowedArray(this.refKeyLists.industryArray, 'label')];
  }

  public submitScreening(): void {

    if (this.screeningForm.valid && !this.isShowCallUsMessage() && !this.disableSubmit) {
      this.disableSubmit = true;
      this.showAddDriverForm = true;
      this.backToTop();
      this.mtaService.refreshToken();
    } else {
      // Show any validation errors
      this.screeningFormSubmitted = true;
    }
    this.disableSubmit = false;
  }

  public backToScreening(): void {
    this.showAddDriverForm = false;
    // Clear any error message when going back
    this.messages = [];
    this.backToTop();
    this.mtaService.refreshToken();
  }

  private initDriverDetailsForm(): void {
    this.dateOfBirthGroup = this.formBuilder.group(
      {
        Day: new FormControl('', [Validators.required, ValidatorUtils.validateDay]),
        Month: new FormControl('', [Validators.required, ValidatorUtils.validateMonth]),
        Year: new FormControl('', [Validators.required, ValidatorUtils.validateYear]),
      },
      {
        validator: ValidatorUtils.validDate('Day', 'Month', 'Year', this.maxDob),
      },
    );

    this.driverDetailsForm = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      firstName: new FormControl('', ValidatorUtils.getFirstNameValidators()),
      lastName: new FormControl('', ValidatorUtils.getLastNameValidators()),
      maritalStatus: new FormControl('', Validators.required),
      gender: new FormControl('', [Validators.required, Validators.pattern('^[M|F]$')]),
      dateOfBirth: this.dateOfBirthGroup,
      employmentStatus: new FormControl('', Validators.required),
      occupation: new FormControl('', this.getOccupationValidators()),
      industry: new FormControl('', this.getIndustryValidators()),
      secondaryOccYesNo: new FormControl('', this.getRequiredValidator()),
      secondaryOccupation: new FormControl('', this.getOccupationValidators()),
      relationship: new FormControl('', Validators.required),
      licenceType: new FormControl('', Validators.required),
      yearsLicenceHeld: new FormControl('', Validators.required),
      monthsLicenceHeld: new FormControl('', this.getRequiredValidator()),
    });
  }

  public submitChanges(): void {
    // Clear any messages
    this.messages = [];
    if (this.driverDetailsForm.valid && !this.disableSubmit) {
      this.disableSubmit = true;
      this.showLoader();
      this.mtaService.postAddDriverChange(this.policy, this.driverDetailsForm.value, this.screeningForm.value).subscribe(
        () => {
          this.changeFormSent = true;
          this.disableSubmit = false;
          this.hideLoader();
          this.backToTop();
        },
        (error: HttpErrorModel) => {
          console.debug('Error submitting add driver changes: ', error);
          this.messages.push({ severity: 'danger', closable: false, summary: 'Unable to process form. Please try again.', heading: '' });
          this.hideLoader();
          this.disableSubmit = false;
          this.scrollToGlobalFormError();
        });

    } else {
      this.driverDetailsFormSubmitted = true;
    }
  }

  public updateScreeningValidators(): void {
    if (this.isPermanentCover()) {
      this.twoDriversAlreadyControl.setValidators(this.getRequiredValidator());

      Object.keys(this.dateFromGroup.controls).forEach((key: string) => {
        this.dateFromGroup.controls[key].clearValidators();
        this.dateFromGroup.controls[key].updateValueAndValidity();
      });

      Object.keys(this.dateUntilGroup.controls).forEach((key: string) => {
        this.dateUntilGroup.controls[key].clearValidators();
        this.dateUntilGroup.controls[key].updateValueAndValidity();
      });

      this.dateFromGroup.clearValidators();
      this.dateUntilGroup.clearValidators();
    } else {
      this.twoDriversAlreadyControl.clearValidators();

      Object.keys(this.dateFromGroup.controls).forEach((key: string) => {
        this.dateFromGroup.controls[key].setValidators(ValidatorUtils.getDateFieldValidators(key));
      });

      Object.keys(this.dateUntilGroup.controls).forEach((key: string) => {
        this.dateUntilGroup.controls[key].setValidators(ValidatorUtils.getDateFieldValidators(key));
      });

      this.dateFromGroup.setValidators(this.getDateFromValidator());
      this.dateUntilGroup.setValidators(this.getDateUntilValidator());
    }

    this.twoDriversAlreadyControl.updateValueAndValidity();
    this.dateFromGroup.updateValueAndValidity();
    this.dateUntilGroup.updateValueAndValidity();
  }

  public updateMonthsLicenceHeldValidators(): void {
    if (this.isShowLicenceMonths()) {
      this.monthsLicenceHeldControl.setValidators(this.getRequiredValidator());
    } else {
      this.monthsLicenceHeldControl.clearValidators();
    }
    this.monthsLicenceHeldControl.updateValueAndValidity();
  }

  public updateOccupationValidators(): void {
    if (this.isShowOccupation()) {
      this.occupationControl.setValidators(this.getOccupationValidators());
      this.industryControl.setValidators(this.getIndustryValidators());
      this.secondaryOccYesNoControl.setValidators(this.getRequiredValidator());
      this.secondaryOccupationControl.setValidators(this.getOccupationValidators());
    } else {
      this.occupationControl.clearValidators();
      this.industryControl.clearValidators();
      this.secondaryOccYesNoControl.clearValidators();
      this.secondaryOccupationControl.clearValidators();
    }
    this.occupationControl.updateValueAndValidity();
    this.industryControl.updateValueAndValidity();
    this.secondaryOccYesNoControl.updateValueAndValidity();
    this.secondaryOccupationControl.updateValueAndValidity();
  }

  public updateSecondaryOccupationValidators(): void {
    if (this.isShowSecondaryOccupation()) {
      this.secondaryOccupationControl.setValidators(this.getOccupationValidators());
    } else {
      this.secondaryOccupationControl.clearValidators();
    }
    this.secondaryOccupationControl.updateValueAndValidity();
  }

  public isShowCallUsMessage(): boolean {
    return (this.twoDriversAlreadyControl.value === 'Y' && this.typeOfCoverControl.value !== 'T') || this.confirmAgreeControl.value === 'N';
  }

  public isShowConfirmField(): boolean {
    return (this.twoDriversAlreadyControl.value === 'N' && this.isPermanentCover()) || this.typeOfCoverControl.value === 'T';
  }

  public isPermanentCover(): boolean {
    return this.typeOfCoverControl.value === 'P';
  }

  public isShowLicenceMonths(): boolean {
    return licenceYearsNeedingMonths.has(this.yearsLicenceHeldControl.value);
  }

  public isShowOccupation(): boolean {
    return employmentStatusNeedingOccupation.has(this.employmentStatusControl.value);
  }

  public isShowSecondaryOccupation(): boolean {
    return this.secondaryOccYesNoControl.value === 'Y';
  }

  get typeOfCoverControl(): AbstractControl {
    return this.screeningForm.get('typeOfCover');
  }

  get twoDriversAlreadyControl(): AbstractControl {
    return this.screeningForm.get('twoDriversAlready');
  }

  get confirmAgreeControl(): AbstractControl {
    return this.screeningForm.get('confirmAgree');
  }

  get employmentStatusControl(): AbstractControl {
    return this.driverDetailsForm.get('employmentStatus');
  }

  get occupationControl(): AbstractControl {
    return this.driverDetailsForm.get('occupation');
  }

  get industryControl(): AbstractControl {
    return this.driverDetailsForm.get('industry');
  }

  get secondaryOccYesNoControl(): AbstractControl {
    return this.driverDetailsForm.get('secondaryOccYesNo');
  }

  get secondaryOccupationControl(): AbstractControl {
    return this.driverDetailsForm.get('secondaryOccupation');
  }

  get yearsLicenceHeldControl(): AbstractControl {
    return this.driverDetailsForm.get('yearsLicenceHeld');
  }

  get monthsLicenceHeldControl(): AbstractControl {
    return this.driverDetailsForm.get('monthsLicenceHeld');
  }
}
