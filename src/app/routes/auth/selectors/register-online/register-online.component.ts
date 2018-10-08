import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { RecaptchaComponent } from 'ng-recaptcha';
import * as moment from 'moment';

import { MasterCustomerCredentials } from '../../../../components/auth/auth.interface';
import { LoadingHandlerComponent } from '../../../../components/shared/loading-handler.component';
import { Message } from '../../../../components/view/global-messages/global-messages.component';
import { ValidatorUtils } from '../../../../components/utils/validator-utils';
import { HttpErrorModel } from '../../../../components/services/http.service';
import { AuthService } from '../../../../components/auth/auth.service';
import { RegisterAccountResponse } from '../../../../models/register-account-response';
import { JWT_RECAPTCHA_ENABLED_KEY_PROPERTY_NAME } from '../../../../components/auth/auth.module';
import { StringUtils } from '../../../../components/utils/string-utils';

@Component({
  selector: 'es-register-online',
  templateUrl: './register-online.component.html',
})
export class RegisterOnlineComponent extends LoadingHandlerComponent implements OnInit {

  policyRegex = '^[0-9]+$';
  postcodeRegex = '^\\s*[A-Za-z]{1,2}([0-9]{1,2}|[0-9][A-Za-z])\\s*[0-9][A-Za-z]{2}\\s*$';

  /**
   * Brand config.
   */
  private phoneNumbers: BrandPhoneNumbers = ESURE_GLOBALS.BRAND_CONFIG.phoneNumbers;

  public credentials: MasterCustomerCredentials; // find master customer form data

  public submitted: boolean = false; // true if form has attempted to be submitted (for validation)
  public disableSubmit: boolean = false; // set to true during login attempt (stops resending form)
  public messages: Message[] = [];
  public recaptchaEnabled: boolean = false;

  public forenameCtrl: FormControl;
  public surnameCtrl: FormControl;
  public postcodeCtrl: FormControl;
  public policyOrRegCtrl: FormControl;
  public policyNumberCtrl: FormControl;
  public registrationNumberCtrl: FormControl;

  public dateFormGroup: FormGroup;
  public form: FormGroup;

  private maxDob = moment.utc().subtract(16, 'years');

  @ViewChild(RecaptchaComponent) recaptchaComponent: RecaptchaComponent;

  @Output() updateDataLayer = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    super();

    const recapEnabledString = this.authService.getKeyFromToken(JWT_RECAPTCHA_ENABLED_KEY_PROPERTY_NAME);
    this.recaptchaEnabled = recapEnabledString && recapEnabledString.toLowerCase() === 'true';
  }

  ngOnInit() {
    this.initForm();
    this.handlePolicyOrRegChange();
  }

  callParent(val: string) {
    this.updateDataLayer.emit(val);
  }

  initForm() {
    this.forenameCtrl = new FormControl('', ValidatorUtils.getFirstNameValidators());
    this.surnameCtrl = new FormControl('', ValidatorUtils.getLastNameValidators());
    this.postcodeCtrl = new FormControl('', [
      Validators.required,
      Validators.pattern(this.postcodeRegex),
      CustomValidators.rangeLength([5, 8]),
    ]);

    this.policyOrRegCtrl = new FormControl('PN', Validators.required);

    this.policyNumberCtrl = new FormControl('', this.getPolicyNumberValidators());
    this.registrationNumberCtrl = new FormControl('', ValidatorUtils.getVehicleRegistrationValidators());

    this.dateFormGroup = this.formBuilder.group(
      {
        dayCtrl: ['', [
          Validators.required,
          ValidatorUtils.validateDay,
        ]],
        monthCtrl: ['', [
          Validators.required,
          ValidatorUtils.validateMonth,
        ]],
        yearCtrl: ['', [
          Validators.required,
          ValidatorUtils.validateYear,
        ]],
      },
      {
        validator: ValidatorUtils.validDate('dayCtrl', 'monthCtrl', 'yearCtrl', this.maxDob),
      },
    );

    this.form = this.formBuilder.group({
      forename: this.forenameCtrl,
      surname: this.surnameCtrl,
      postcode: this.postcodeCtrl,
      dob: this.dateFormGroup,
      policyOrReg: this.policyOrRegCtrl,
      policyId: this.policyNumberCtrl,
      vehicleReg: this.registrationNumberCtrl,
    });

  }

  /**
   * Get the validators to use for the policy number field.
   * @return {array} validators to use
   */
  private getPolicyNumberValidators() {
    return [Validators.required, CustomValidators.rangeLength([3, 20]), Validators.pattern(this.policyRegex)];
  }

  /**
   * Click handler for updating the validators when policy number or registration buttons are clicked.
   * Also called on init of component to correctly remove any validators if form is already pre populated with a chosen option.
   */
  handlePolicyOrRegChange() {
    /* istanbul ignore next */
    if (this.policyOrReg.valid) {
      const chosenOption = this.policyOrReg.value;
      if (chosenOption === 'PN') {
        // Clear validators on vehicle reg field
        this.vehicleReg.setValidators(null);
        // Re apply validators to policy number field
        this.policyNumber.setValidators(this.getPolicyNumberValidators());
        // reset validation issues
        this.submitted = false;
      } else {
        // Clear validators on policy number field
        this.policyNumber.setValidators(null);
        // Re apply validators to vehicle reg field
        this.vehicleReg.setValidators(ValidatorUtils.getVehicleRegistrationValidators());
        // reset validation issues
        this.submitted = false;
      }
      // Tell Angular we've made updates to both form fields
      this.policyNumber.updateValueAndValidity();
      this.vehicleReg.updateValueAndValidity();

      this.callParent(this.policyOrReg.value === 'PN' ? 'PolicyNumber' : 'CarRegistration');
    }

  }

  get policyOrReg(): AbstractControl {
    return this.form.get('policyOrReg');
  }

  get policyNumber(): AbstractControl {
    return this.form.get('policyId');
  }

  get vehicleReg(): AbstractControl {
    return this.form.get('vehicleReg');
  }

  onSubmit(captchaResponse: string) {
    // Clear any messages
    this.messages = [];

    if (this.form.valid && !this.disableSubmit) {

      this.disableSubmit = true;
      this.showLoader();

      const formattedDobDate =
        [this.dateFormGroup.value.yearCtrl, this.dateFormGroup.value.monthCtrl, this.dateFormGroup.value.dayCtrl].join('-').toString();
      const requiredDobFormat = moment.utc(formattedDobDate, 'YYYY-MM-DD').toISOString();

      // Uppercase and remove spaces from the postcode and vehicle reg fields
      this.postcodeCtrl.setValue(StringUtils.removeWhitespaceAndMakeUppercase(this.postcodeCtrl.value));
      this.vehicleReg.setValue(StringUtils.removeWhitespaceAndMakeUppercase(this.vehicleReg.value));

      this.credentials = {
        forename: this.forenameCtrl.value.trim(),
        surname: this.surnameCtrl.value.trim(),
        dateOfBirth: requiredDobFormat,
        postcode: this.postcodeCtrl.value,
        policyId: this.policyOrReg.value === 'PN' ? this.policyNumberCtrl.value : undefined,
        vehicleRegistrationNumber: this.policyOrReg.value === 'RN' ? this.registrationNumberCtrl.value : undefined,
      };

      this.authService.findMasterCust(this.credentials, captchaResponse).subscribe(
        (data: RegisterAccountResponse) => {
          const createUrl = data.accountCreated ? /* istanbul ignore next */ '' : '/create';
          return this.router.navigateByUrl(`/auth/register/confirmation${createUrl}`);
        },
        /* istanbul ignore next */
        (error: HttpErrorModel) => {
          if (error.body['message'] === 'RECAPTCHA_ERROR') {
            console.debug('RECAPTCHA_ERROR so navigating to login unavailable page....');
            return this.router.navigateByUrl('/auth/login/unavailable');
          }
          console.debug('Error with finding master customer: ', error);
          this.setFormError();
        });
    } else {
      this.submitted = true; // shows validation issues

    }
  }

  setFormError() {
    this.disableSubmit = false;
    this.messages.push({
      heading: 'Unfortunately we can\'t update your password',
      summary: `Please check the details you've entered and try again.<br />If you didn't give us your email address when buying
      your policy, or have further problems entering your details please call our helpful customer service team on
      <a href="tel:${this.phoneNumbers.motorCustomerService}">${this.phoneNumbers.motorCustomerService}</a> who will be able to help you.<br />
      Lines are open Mon-Fri 8am-8pm, Sat 9am-5pm, Sun 9am-2pm.`,
      severity: 'danger',
      closable: false,
    });
    this.hideLoader();
    this.scrollToGlobalFormErrorUnauth();
    /* istanbul ignore next */
    if (this.recaptchaComponent !== undefined) {
      this.recaptchaComponent.reset();
    }
  }
}
