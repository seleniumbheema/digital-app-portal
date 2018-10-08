import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PortalComponent } from './portal.component';
import { PoliciesComponent } from './policies/policies.component';
import { PolicyComponent } from './policies/policy/policy.component';
import { PolicyDetailsComponent } from './policies/policy/policy-details/policy-details.component';
import { PolicyDocumentsComponent } from './policies/policy/policy-documents/policy-documents.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { SpecialOffersComponent } from './special-offers/special-offers.component';
import { DisallowedBrandsGuard } from '../../components/auth/guards/disallowed-brands-guard';
import { LoggedInGuard } from '../../components/auth/guards/logged-in.guard';
import { PoliciesResolver } from '../../components/resolvers/policies.resolver';
import { PolicyResolver } from '../../components/resolvers/policy.resolver';
import { DocumentsResolver } from '../../components/resolvers/documents.resolver';
import { CustomerResolver } from '../../components/resolvers/customer.resolver';
import { PolicyClaimsComponent } from './policies/policy/policy-claims/policy-claims.component';
import { PolicyAmendmentsComponent } from './policies/policy/policy-amendments/policy-amendments.component';
import { PolicyChangeCarComponent } from './policies/policy/policy-amendments/policy-change-car/policy-change-car.component';
import { PolicyAddConvictionComponent } from './policies/policy/policy-amendments/policy-add-conviction/policy-add-conviction.component';
import { AddDriverComponent } from './policies/policy/policy-amendments/add-driver/add-driver.component';
import { PolicyChangeRegistrationComponent }
  from './policies/policy/policy-amendments/policy-change-registration/policy-change-registration.component';

const PORTAL_ROUTES: Routes = [
  {
    path: '',
    component: PortalComponent,
    canActivate: [LoggedInGuard],
    canActivateChild: [LoggedInGuard],
    resolve: { customer: CustomerResolver },
    children: [
      { path: '', redirectTo: 'policies', pathMatch: 'full' },
      {
        path: 'policies', resolve: { policies: PoliciesResolver },
        children: [
          { path: '', component: PoliciesComponent },
          { path: 'welcome', component: PoliciesComponent, data: { welcome: true } },
          {
            path: 'motor/:policyNumber/:sequenceNumber',
            component: PolicyComponent,
            resolve: { policy: PolicyResolver, documents: DocumentsResolver },
            data: { policyType: 'motor' },
            children: [
              { path: '', redirectTo: 'details', pathMatch: 'full' },
              { path: 'details', component: PolicyDetailsComponent },
              { path: 'documents', component: PolicyDocumentsComponent },
              {
                path: 'amendments',
                children: [
                  { path: '', component: PolicyAmendmentsComponent },
                  { path: 'change-car', component: PolicyChangeCarComponent },
                  { path: 'motor-conviction', component: PolicyAddConvictionComponent },
                  { path: 'change-registration', component: PolicyChangeRegistrationComponent },
                  { path: 'add-driver', component: AddDriverComponent },
                ],
              },
              { path: 'claim', component: PolicyClaimsComponent },
            ],
          },
          {
            path: 'home/:policyNumber/:sequenceNumber',
            component: PolicyComponent,
            resolve: { policy: PolicyResolver, documents: DocumentsResolver },
            data: { policyType: 'home' },
            children: [
              { path: '', redirectTo: 'details', pathMatch: 'full' },
              { path: 'details', component: PolicyDetailsComponent },
              { path: 'documents', component: PolicyDocumentsComponent },
              {
                path: 'amendments',
                children: [
                  { path: '', component: PolicyAmendmentsComponent },
                ],
              },
              { path: 'claim', component: PolicyClaimsComponent },
            ],
          },
        ],
      },
      // DAI-44
      // {
      //   path: 'account', component: MyAccountComponent,
      // },
      {
        path: 'offers', component: SpecialOffersComponent, canActivate: [DisallowedBrandsGuard], data: { disallowedBrands: ['FA'] },
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(PORTAL_ROUTES),
  ],
  exports: [
    RouterModule,
  ],
})
/* istanbul ignore next */
export class PortalRoutingModule { }

export const routingComponents = [PortalComponent, PoliciesComponent, PolicyComponent,
  MyAccountComponent, PolicyDetailsComponent, PolicyDocumentsComponent, PolicyClaimsComponent,
  PolicyAmendmentsComponent, PolicyChangeCarComponent, AddDriverComponent, PolicyAddConvictionComponent, SpecialOffersComponent];

export const routingResolvers = [DocumentsResolver, PoliciesResolver, PolicyResolver, CustomerResolver];
