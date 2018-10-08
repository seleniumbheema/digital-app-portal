import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { HttpService, HttpErrorModel } from './http.service';
import { CustomerDataService } from './customer-data.service';
import { MotorPolicyDetails } from '../../models/policy/motor-details';
import { NumberUtils } from '../utils/number-utils';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class MtaService {

  constructor(private httpService: HttpService, private customerService: CustomerDataService, private authService: AuthService) {
  }

  public postCarChange(policy: MotorPolicyDetails, changeForm: any): Observable<void | HttpErrorModel> {

    const formattedPurchaseDate = changeForm.purchased === 'N' ? undefined :
      [NumberUtils.pad(changeForm.purchaseDate.Day, 2), NumberUtils.pad(changeForm.purchaseDate.Month, 2), changeForm.purchaseDate.Year].join('/');

    const mtaDetails = {
      changes: {
        registration: changeForm.registration,
        valuation: changeForm.valuation.toString(),
        purchased: (changeForm.purchased === 'Y') ? 'Yes' : 'No',
        purchaseDate: formattedPurchaseDate,
        tracker: 'No',
      },
      customer: this.getCustomer(policy),
    };

    return this.httpService.post<void>('/mtas/car-change', mtaDetails);
  }

  public postConvictionChange(policy: MotorPolicyDetails, convictionDetails: any): Observable<void | HttpErrorModel> {

    const mtaDetails = {
      changes: convictionDetails,
      customer: this.getCustomer(policy),
    };

    return this.httpService.post<void>('/mtas/conviction-change', mtaDetails);
  }

  public postRegistrationChanges(policy: MotorPolicyDetails, changeForm: any): Observable<void | HttpErrorModel> {
    const mtaDetails = {
      changes: {
        registration: changeForm.registration,
      },
      customer: this.getCustomer(policy),
    };
    return this.httpService.post<void>('/mtas/car-registration', mtaDetails);
  }

  public postAddDriverChange(policy: MotorPolicyDetails, driverChangesForm: any, screeningForm: any): Observable<void | HttpErrorModel> {

    // Create new copies of the form data, because we are going to modify properties, so don't want to touch the original data
    const driverChanges = {
      ...driverChangesForm,
    };

    const screenForm = {
      ...screeningForm,
    };

    const dobGroup = driverChanges.dateOfBirth;
    const formattedDobDate = [NumberUtils.pad(dobGroup.Day, 2), NumberUtils.pad(dobGroup.Month, 2), dobGroup.Year].join('/');
    driverChanges.dateOfBirth = formattedDobDate;

    if (screenForm.typeOfCover === 'P') {
      screenForm.typeOfCover = 'Permanent';
      delete screenForm.dateFrom;
      delete screenForm.dateUntil;
    } else {
      screenForm.typeOfCover = 'Temporary';
      const fromGroup = screenForm.dateFrom;
      const formattedFromDate = [NumberUtils.pad(fromGroup.Day, 2), NumberUtils.pad(fromGroup.Month, 2), fromGroup.Year].join('/');
      screenForm.dateFrom = formattedFromDate;

      const untilGroup = screenForm.dateUntil;
      const formattedUntilDate = [NumberUtils.pad(untilGroup.Day, 2), NumberUtils.pad(untilGroup.Month, 2), untilGroup.Year].join('/');
      screenForm.dateUntil = formattedUntilDate;

      delete screenForm.twoDriversAlready;
    }

    const mtaDetails = {
      changes: { ...screenForm, ...driverChanges },
      customer: this.getCustomer(policy),
    };
    return this.httpService.post<void>('/mtas/add-driver', mtaDetails);
  }

  public refreshToken(): void {
    this.authService.refreshToken().subscribe(() => { }, () => { });
  }

  private getCustomer(policy) {
    return {
      firstName: this.customerService.customer.firstName,
      lastName: this.customerService.customer.lastName,
      dateOfBirth: moment(this.customerService.customer.dateOfBirth).format('DD/MM/YYYY'),
      postcode: this.customerService.customer.address.postcode,
      house: `${this.customerService.customer.address.houseName} ${this.customerService.customer.address.houseNumber}`.trim(),
      email: this.customerService.customer.email,
      policyNumber: policy.number.toString(),
    };
  }

}
