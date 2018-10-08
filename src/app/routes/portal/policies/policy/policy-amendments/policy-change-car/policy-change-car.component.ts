import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

import { ValidatorUtils } from '../../../../../../components/utils/validator-utils';
import { VehicleDataService } from '../../../../../../components/services/vehicle-data.service';
import { MtaService } from '../../../../../../components/services/mta.service';
import { HttpErrorModel } from '../../../../../../components/services/http.service';
import { MotorPolicyDetails } from '../../../../../../models/policy/motor-details';
import { LoadingHandlerComponent } from '../../../../../../components/shared/loading-handler.component';
import { Message } from '../../../../../../components/view/global-messages/global-messages.component';
import { StringUtils } from '../../../../../../components/utils/string-utils';

interface CarDetails {
  make: string;
  model: string;
  registration: string;
  registrationDate: string;
  transmission: string;
}

interface ResponseVehicle {
  make: string;
  model: string;
  fuel: string;
  transmission: string;
  registrationDate: string;
}

@Component({
  templateUrl: './policy-change-car.component.html',
})
export class PolicyChangeCarComponent extends LoadingHandlerComponent implements OnInit {

  public policy: MotorPolicyDetails;
  public phoneNumbers: BrandPhoneNumbers = ESURE_GLOBALS.BRAND_CONFIG.phoneNumbers;
  public messages: Message[] = [];

  public disableSubmit: boolean = false; // set to true during form submission attempt (stops resending form)

  public screeningForm: FormGroup;
  public screeningFormSubmitted: boolean = false;
  public showChangeCarForm: boolean = false;

  public changeForm: FormGroup;
  public purchaseDateGroup: FormGroup;
  public changeFormSubmitted: boolean = false;
  public changeFormCarFound: boolean;
  public changeFormSent: boolean;

  public foundCar: CarDetails = null;

  private maxPurchaseDate = moment.utc();

  constructor(
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public vehicleService: VehicleDataService,
    public mtaService: MtaService,
  ) {
    super();
  }

  ngOnInit() {
    this.route.parent.parent.data.subscribe((data: any) => {
      this.policy = data.policy;

      this.initScreeningForm();
      this.initChangeForm();
    });
  }

  private initScreeningForm(): void {
    this.screeningForm = this.formBuilder.group({
      modified: new FormControl('', Validators.required),
      owner: new FormControl('', Validators.required),
      registrationKnown: new FormControl('', Validators.required),
    });
  }

  public submitScreening(): void {
    if (this.screeningForm.valid && !this.isShowCallUsMessage() && !this.disableSubmit) {
      this.disableSubmit = true;
      this.showChangeCarForm = true;
      this.backToTop();
      this.mtaService.refreshToken();
    } else {
      // Show any validation errors
      this.screeningFormSubmitted = true;
    }
    this.disableSubmit = false;
  }

  public backToScreening(): void {
    this.showChangeCarForm = false;
    // Clear any error message when going back
    this.messages = [];
    this.backToTop();
    this.mtaService.refreshToken();
  }

  private getPurchaseDateValidator(): ValidatorFn {
    return ValidatorUtils.validDate('Day', 'Month', 'Year', this.maxPurchaseDate, null);
  }

  public updatePurchaseDateValidator(): void {
    if (this.isShowPurchaseDate()) {
      Object.keys(this.purchaseDateGroup.controls).forEach((key: string) => {
        this.purchaseDateGroup.controls[key].setValidators(ValidatorUtils.getDateFieldValidators(key));
      });

      this.purchaseDateGroup.setValidators(this.getPurchaseDateValidator());

    } else {
      Object.keys(this.purchaseDateGroup.controls).forEach((key: string) => {
        this.purchaseDateGroup.controls[key].clearValidators();
        this.purchaseDateGroup.controls[key].updateValueAndValidity();
      });

      this.purchaseDateGroup.clearValidators();
    }

    this.purchaseDateGroup.updateValueAndValidity();
  }

  private initChangeForm(): void {
    this.purchaseDateGroup = this.formBuilder.group(
      {
        Day: new FormControl('', [Validators.required, ValidatorUtils.validateDay]),
        Month: new FormControl('', [Validators.required, ValidatorUtils.validateMonth]),
        Year: new FormControl('', [Validators.required, ValidatorUtils.validateYear]),
      },
      {
        validator: this.getPurchaseDateValidator(),
      },
    );

    this.changeForm = this.formBuilder.group({
      registration: new FormControl('', ValidatorUtils.getVehicleRegistrationValidators()),
      valuation: new FormControl('', [Validators.required, ValidatorUtils.validateValue]),
      purchased: new FormControl('', Validators.required),
      purchaseDate: this.purchaseDateGroup,
    });
  }

  public findCar(): void {
    this.foundCar = null;
    this.changeFormCarFound = null;

    if (this.registrationControl.valid) {
      // Uppercase the reg field and remove spaces
      const registrationNumber = StringUtils.removeWhitespaceAndMakeUppercase(this.registrationControl.value);

      this.showLoader();
      this.vehicleService.getVehicleWithReg(registrationNumber).subscribe(
        (data: { vehicle: ResponseVehicle }) => {
          this.hideLoader();
          this.changeFormCarFound = true;
          this.changeFormSubmitted = false;
          this.foundCar = {
            make: data.vehicle.make,
            model: data.vehicle.model,
            registration: registrationNumber,
            registrationDate: data.vehicle.registrationDate,
            transmission: (data.vehicle.transmission === 'M') ? 'Manual' : 'Automatic',
          };
        },
        (error: HttpErrorModel) => {
          console.debug('Error finding car by reg: ', error);
          this.hideLoader();
          this.changeFormCarFound = false;
        });

    } else {
      this.changeFormSubmitted = true;
    }
  }

  incorrectCar() {
    this.foundCar = null;
    this.changeFormCarFound = false;
    this.changeForm.reset();
  }

  public isShowCallUsMessage(): boolean {
    return this.registrationKnownControl.value === 'N' || this.ownerControl.value === 'N' || this.modifiedControl.value === 'Y';
  }

  public submitChanges() {
    // Clear any messages
    this.messages = [];
    if (this.changeForm.valid && this.foundCar !== null) {
      this.disableSubmit = true;
      this.showLoader();

      // Uppercase the reg field and remove spaces
      this.registrationControl.setValue(StringUtils.removeWhitespaceAndMakeUppercase(this.registrationControl.value));

      this.mtaService.postCarChange(this.policy, this.changeForm.value).subscribe(
        () => {
          this.changeFormSent = true;
          this.hideLoader();
          this.backToTop();
        },
        (error: HttpErrorModel) => {
          console.debug('Error submitting change car changes: ', error);
          this.messages.push({ severity: 'danger', closable: false, summary: 'Unable to process form. Please try again.', heading: '' });
          this.hideLoader();
          this.changeFormSubmitted = true;
          this.disableSubmit = false;
          this.scrollToGlobalFormError();
        },
      );
    } else {
      this.changeFormSubmitted = true;
    }
  }

  public isShowPurchaseDate(): boolean {
    return this.purchasedControl.value === 'Y';
  }

  get registrationKnownControl(): AbstractControl {
    return this.screeningForm.get('registrationKnown');
  }

  get ownerControl(): AbstractControl {
    return this.screeningForm.get('owner');
  }

  get modifiedControl(): AbstractControl {
    return this.screeningForm.get('modified');
  }

  get purchasedControl(): AbstractControl {
    return this.changeForm.get('purchased');
  }

  get registrationControl(): AbstractControl {
    return this.changeForm.get('registration');
  }
}
