import { NgModule, NO_ERRORS_SCHEMA, Optional, SkipSelf } from '@angular/core';
import { SidebarModule } from 'ng-sidebar';
import { Ng2CompleterModule } from 'ng2-completer';

import { PolicyCardComponent } from '../../components/view/policy-card/policy-card.component';
import { NavBarComponent } from '../../components/view/nav-bar/nav-bar.component';
import { PortalRoutingModule, routingComponents, routingResolvers } from './portal.routes';
import { SharedModule } from '../../components/shared/shared.module';
import { PolicyLapsedPipe } from '../../components/pipes/policy-lapsed.pipe';
import { MotorPolicyDetailsComponent } from '../../components/view/motor-policy-details/motor-policy-details.component';
import { HomePolicyDetailsComponent } from '../../components/view/home-policy-details/home-policy-details.component';
import { VehicleDataService } from '../../components/services/vehicle-data.service';
import { MtaService } from '../../components/services/mta.service';
import { PolicyChangeRegistrationComponent } from
  './policies/policy/policy-amendments/policy-change-registration/policy-change-registration.component';
import { AutocompleteFieldComponent } from '../../components/view/forms/autocomplete/autocomplete-field.component';

console.debug('ROUTE: PortalModule loaded asynchronously');

/**
 * Portal module.
 */
@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    PolicyCardComponent,
    NavBarComponent,
    PolicyLapsedPipe,
    routingComponents,
    MotorPolicyDetailsComponent,
    HomePolicyDetailsComponent,
    PolicyChangeRegistrationComponent,
    AutocompleteFieldComponent,
  ],
  imports: [
    PortalRoutingModule,
    SharedModule,
    SidebarModule,
    Ng2CompleterModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    routingResolvers,
    VehicleDataService,
    MtaService,
  ],
})
/* istanbul ignore next */
export class PortalModule {

  constructor(
    @Optional() @SkipSelf() parentModule: PortalModule) {
    if (parentModule) {
      throw new Error('PortalModule is already loaded. It is designed to be lazy loaded only once');
    }
  }
}
