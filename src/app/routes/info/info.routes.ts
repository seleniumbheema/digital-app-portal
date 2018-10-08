import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InfoComponent } from './info.component';
import { AccidentSupportComponent } from './accident-support/accident-support.component';
import { DisallowedBrandsGuard } from '../../components/auth/guards/disallowed-brands-guard';

const INFO_ROUTES: Routes = [
  {
    path: '', component: InfoComponent,
    children: [
      { path: '', redirectTo: '/error/404', pathMatch: 'full' },
      { path: 'accident-support', component: AccidentSupportComponent, canActivate: [DisallowedBrandsGuard], data: { disallowedBrands: ['FA'] } },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(INFO_ROUTES),
  ],
  exports: [
    RouterModule,
  ],
})
/* istanbul ignore next */
export class InfoRoutingModule { }

export const routingComponents = [InfoComponent, AccidentSupportComponent];
