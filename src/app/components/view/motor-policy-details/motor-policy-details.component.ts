import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

import { MotorPolicyDetails } from '../../../models/policy/motor-details';
import { Message } from '../global-messages/global-messages.component';

const roadsideAssistanceHelp = `<p>If your car breaks down a &frac14; of a mile away from your home the RAC will arrange:</p>
<p><span class="has-text-weight-bold">Roadside Assistance</span> &ndash; up to 1 hour's labour of repair at the roadside.<br />
<span class="has-text-weight-bold">Towing to repairer</span> &ndash; if your car can't be repaired at the roadside, you and up to 8
passengers will be taken to the nearest repairer or to a destination of your choice within 10 miles of the breakdown.<br />
 <span class="has-text-weight-bold">Completion of your journey</span> - RAC will, at your expense, help arrange to get you and up
 to 8 passengers home, or to another destination of your choice. They can also put you in touch with a hotel, or a car hire company
 so you can complete your journey. Please bear in mind your home or destination needs to be within RAC's territorial limits.</p>`;

const homeRescueHelp = `<p><span class="has-text-weight-bold">Home Rescue</span> &ndash; if your car can't be repaired within an hour
at the roadside, you can claim up to &pound;10 for alternative transport, but you must keep your receipt.</p>`;

const recoveryHelp = `<p><span class="has-text-weight-bold">Recovery</span> &ndash; if your car breaks down or is involved in an accident,
and can't be repaired at the roadside, the RAC will arrange recovery. Plus you have all the services mentioned in Roadside Assistance,
and Home Rescue.</p>`;

const anyVehicleExtensionHelp = `<p><span class="has-text-weight-bold">Any Vehicle Extension</span> &ndash; you and your partner have
Roadside Assistance, Home Rescue, and Recovery when driving any car, van or three-wheeler up to 3500kg when loaded
– providing the vehicle you're driving isn't excluded from your policy.</p>`;

const noBreakdownHelp = `<p>We've partnered with the RAC, never get stuck on the road again &ndash; choose between 4 levels of breakdown cover.
Find out more on our Breakdown Assistance page.</p><p>If you would like to add any level of Breakdown Cover to your policy please call
<a href="tel:${ESURE_GLOBALS.BRAND_CONFIG.phoneNumbers.motorCustomerService}">${ESURE_GLOBALS.BRAND_CONFIG.phoneNumbers.motorCustomerService}</a>.</p>
<p>Lines are open Mon to Fri 8am&ndash;8pm, Sat 9am&ndash;5pm, Sun 9am&ndash;2pm</p>`;

interface BreakdownOption {
  name: string;
  helpText: string;
}

const breakdownCodes = new Map<string, BreakdownOption>()
  .set('BK1', { name: 'Roadside Assistance', helpText: roadsideAssistanceHelp })
  .set('BK2', { name: 'Roadside Assistance and Any Vehicle Extension', helpText: roadsideAssistanceHelp + anyVehicleExtensionHelp })
  .set('BK3', { name: 'Roadside Assistance, Home Rescue, and Recovery', helpText: roadsideAssistanceHelp + homeRescueHelp + recoveryHelp })
  .set('BK4', {
    name: 'Roadside Assistance, Home Rescue, Recovery and Any Vehicle Extension',
    helpText: roadsideAssistanceHelp + homeRescueHelp + recoveryHelp + anyVehicleExtensionHelp,
  })
  .set('BK5', { name: 'Roadside Assistance and Home Rescue', helpText: roadsideAssistanceHelp + homeRescueHelp })
  .set('BK6', {
    name: 'Roadside Assistance, Home Rescue and Any Vehicle Extension',
    helpText: roadsideAssistanceHelp + homeRescueHelp + anyVehicleExtensionHelp,
  })
  .set('BKNONE', { name: 'Breakdown Cover', helpText: noBreakdownHelp });

@Component({
  selector: 'es-motor-policy-details',
  templateUrl: './motor-policy-details.component.html',
})
export class MotorPolicyDetailsComponent implements OnInit {

  @Input() policy: MotorPolicyDetails;

  public phoneNumbers: BrandPhoneNumbers = ESURE_GLOBALS.BRAND_CONFIG.phoneNumbers;

  public messages: Message[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * Works our whether Breakdown cover should be shown in the optional extras list. If it's purchased, then show it.
   * If it's not purchased then check if the car registration date is more than 15 years before the cover start date,
   * if it is more than 15 years then do not show it all on screen.
   * @param purchased whether breakdown has been purchased
   * @returns true or false
   */
  public isCarEligibleForBreakdownCover(purchased: boolean): boolean {
    let eligible = true;
    if (!purchased) {
      const coverStartDate = moment(this.policy.startDate);
      const vehicleRegistrationDate = moment(this.policy.vehicle.dateOfRegistration);
      const yearsDiff = coverStartDate.diff(vehicleRegistrationDate, 'years');
      eligible = yearsDiff < 15;
    }
    return eligible;
  }

  /**
   * Determines if the addon code is a breakdown code.
   * @param code
   * @returns true if the code is a breakdown code
   */
  public isBreakdownAddon(code: string): boolean {
    return breakdownCodes.has(code);
  }

  /**
   * Get the breakdown description based on the code.
   * @param code
   * @returns breakdown description
   */
  public getBreakdownDescription(code: string): string {
    return breakdownCodes.get(code).name;
  }

  public getBreakdownHelpText(code: string): string {
    return breakdownCodes.get(code).helpText;
  }

}
