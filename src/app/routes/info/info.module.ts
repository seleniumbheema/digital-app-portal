import { NgModule, Optional, SkipSelf } from '@angular/core';

import { InfoRoutingModule, routingComponents } from './info.routes';
import { SharedModule } from '../../components/shared/shared.module';

console.debug('ROUTE: InfoModule loaded asynchronously');

/**
 * Info pages module.
 */
@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    routingComponents,
  ],
  imports: [
    InfoRoutingModule,
    SharedModule,
  ],
})
export class InfoModule {

  constructor(
    @Optional() @SkipSelf() parentModule: InfoModule) {
    if (parentModule) {
      throw new Error('InfoModule is already loaded. It is designed to be lazy loaded only once');
    }
  }
}
