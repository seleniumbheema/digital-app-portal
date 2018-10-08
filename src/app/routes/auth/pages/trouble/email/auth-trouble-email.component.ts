// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
// import { CustomValidators } from 'ng2-validation';
// import * as moment from 'moment';

// import { AuthService } from '../../../../../components/auth/auth.service';
// import { ValidatorUtils } from '../../../../../components/utils/validator-utils';
// import { UserNameRetrievalDetails } from '../../../../../components/auth/auth.interface';
// import { Message } from '../../../../../components/view/global-messages/global-messages.component';
// import { LoadingHandlerComponent } from '../../../../../components/shared/loading-handler.component';
// import { NumberUtils } from '../../../../../components/utils/number-utils';
// import { StringUtils } from '../../../../../components/utils/string-utils';

// @Component({
//   templateUrl: './auth-trouble-email.component.html',
// })
// export class AuthTroubleEmailComponent extends LoadingHandlerComponent implements OnInit {

//   public userDetails: UserNameRetrievalDetails;
//   public username: string;

//   public submitted: boolean = false; // true if screeningForm has attempted to be sumbitted (for validation)
//   public disableSubmit: boolean = false; // set to true during login attempt (stops resending screeningForm)

//   public form: FormGroup;
//   public dateOfBirthGroup: FormGroup;
//   public messages: Message[] = [];

//   private fnameControl: FormControl;
//   private lnameControl: FormControl;
//   private postCodeControl: FormControl;

//   private dobDayControl: FormControl;
//   private dobMonthControl: FormControl;
//   private dobYearControl: FormControl;

//   private maxDob = moment().subtract(16, 'years');

//   constructor(
//     public formBuilder: FormBuilder,
//     public authService: AuthService,
//   ) {
//     super();
//     const postcodeRegex = '^\\s*[A-Za-z]{1,2}([0-9]{1,2}|[0-9][A-Za-z])\\s*[0-9][A-Za-z]{2}\\s*$';
//     const namesRegex = '^[a-zA-Z-.\']+$';
//     this.fnameControl = new FormControl('', [Validators.required, CustomValidators.rangeLength([2, 40]), Validators.pattern(namesRegex)]);
//     this.lnameControl = new FormControl('', [Validators.required, CustomValidators.rangeLength([2, 40]), Validators.pattern(namesRegex)]);
//     this.postCodeControl = new FormControl('', [Validators.required, CustomValidators.rangeLength([5, 8]), Validators.pattern(postcodeRegex)]);

//     this.dobDayControl = new FormControl('', [
//       Validators.required,
//       ValidatorUtils.validateDay,
//     ]);

//     this.dobMonthControl = new FormControl('', [
//       Validators.required,
//       ValidatorUtils.validateMonth,
//     ]);

//     this.dobYearControl = new FormControl('', [
//       Validators.required,
//       ValidatorUtils.validateYear,
//     ]);
//   }

//   ngOnInit() {

//     this.dateOfBirthGroup = this.formBuilder.group(
//       {
//         Day: this.dobDayControl,
//         Month: this.dobMonthControl,
//         Year: this.dobYearControl,
//       },
//       {
//         validator: ValidatorUtils.validDate('Day', 'Month', 'Year', this.maxDob),
//       },
//     );
//     this.form = this.formBuilder.group({
//       Fname: this.fnameControl,
//       Lname: this.lnameControl,
//       Postcode: this.postCodeControl,
//       DateOfBirth: this.dateOfBirthGroup,
//     });
//   }

//   onSubmit() {
//     // Clear any messages
//     this.messages = [];
//     if (this.form.valid) {
//       this.disableSubmit = true;
//       this.showLoader();

//       // Sanitise the postcode
//       this.postCodeControl.setValue(StringUtils.removeWhitespaceAndMakeUppercase(this.postCodeControl.value));
//       // Create the userDetails to be passed to the service
//       this.userDetails = {
//         firstName: this.fnameControl.value,
//         lastName: this.lnameControl.value,
//         postcode: this.postCodeControl.value,
//         dob: `${this.dobYearControl.value}-${NumberUtils.pad(this.dobMonthControl.value, 2)}-${NumberUtils.pad(this.dobDayControl.value, 2)}`,
//       };

//       this.authService
//         .getUsernameFromCustomerDetails(this.userDetails)
//         .then((email) => {
//           this.username = email;
//           // this.authService.setUserEmail(email);
//           this.hideLoader();
//         })
//         .catch(() => {
//           this.disableSubmit = false;
//           this.messages.push({ severity: 'danger', closable: false, summary: 'Invalid details - please try again.', heading: '' });
//           this.hideLoader();
//         });
//     } else {
//       this.submitted = true; // shows validation issues
//     }
//   }

// }
