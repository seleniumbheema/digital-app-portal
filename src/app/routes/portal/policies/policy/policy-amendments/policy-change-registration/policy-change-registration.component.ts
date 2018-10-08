import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, AbstractControl } from '@angular/forms';

import { ValidatorUtils } from '../../../../../../components/utils/validator-utils';
import { MtaService } from '../../../../../../components/services/mta.service';
import { LoadingHandlerComponent } from '../../../../../../components/shared/loading-handler.component';
import { MotorPolicyDetails } from '../../../../../../models/policy/motor-details';
import { HttpErrorModel } from '../../../../../../components/services/http.service';
import { Message } from '../../../../../../components/view/global-messages/global-messages.component';
import { StringUtils } from '../../../../../../components/utils/string-utils';

@Component({
  templateUrl: './policy-change-registration.component.html',
})
export class PolicyChangeRegistrationComponent extends LoadingHandlerComponent implements OnInit {

  public policy: MotorPolicyDetails;
  public phoneNumbers: BrandPhoneNumbers = ESURE_GLOBALS.BRAND_CONFIG.phoneNumbers;
  public messages: Message[] = [];

  public changeForm: FormGroup;
  public changeFormSubmitted: boolean = false;
  public changeFormSent: boolean;
  public disableSubmit: boolean = false; // set to true during form submission (stops resending form)

  constructor(
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public mtaService: MtaService,
  ) {
    super();
  }

  ngOnInit() {
    this.route.parent.parent.data.subscribe((data: any) => {
      this.policy = data.policy;

      this.initChangeForm();
    });
  }

  initChangeForm() {
    this.changeForm = this.formBuilder.group({
      registration: new FormControl('', ValidatorUtils.getVehicleRegistrationValidators()),
    });
  }

  submitChanges() {
    // Clear any messages
    this.messages = [];
    if (this.changeForm.valid && !this.disableSubmit) {
      this.disableSubmit = true;
      this.showLoader();
      // Uppercase the reg field and remove spaces
      this.registrationControl.setValue(StringUtils.removeWhitespaceAndMakeUppercase(this.registrationControl.value));
      this.mtaService.postRegistrationChanges(this.policy, this.changeForm.value).subscribe(
        () => {
          this.changeFormSent = true;
          this.hideLoader();
          this.backToTop();
        },
        (error: HttpErrorModel) => {
          console.debug('Error submitting change vehicle reg: ', error);
          this.messages.push({ severity: 'danger', closable: false, summary: 'Unable to process form. Please try again.', heading: '' });
          this.hideLoader();
          this.disableSubmit = false;
          this.scrollToGlobalFormError();
        });
    } else {
      this.changeFormSubmitted = true;
    }
  }

  get registrationControl(): AbstractControl {
    return this.changeForm.get('registration');
  }
}
