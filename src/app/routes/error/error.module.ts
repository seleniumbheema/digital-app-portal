import { NgModule, Optional, SkipSelf } from '@angular/core';

import { ErrorRoutingModule, routingComponents } from './error.routes';
import { SharedModule } from '../../components/shared/shared.module';

console.debug('ROUTE: ErrorModule loaded asynchronously');

/**
 * Error pages module.
 */
@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    routingComponents,
  ],
  imports: [
    ErrorRoutingModule,
    SharedModule,
  ],
})
export class ErrorModule {

  constructor(
    @Optional() @SkipSelf() parentModule: ErrorModule) {
    if (parentModule) {
      throw new Error('ErrorModule is already loaded. It is designed to be lazy loaded only once');
    }
  }
}
