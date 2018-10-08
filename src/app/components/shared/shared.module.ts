import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BrandImagePipe } from '../pipes/brand-image.pipe';
import { BrandUrlPipe } from '../pipes/brand-url.pipe';
import { CapitalizePipe } from '../pipes/capitalize.pipe';
import { DataLayerComponent } from './data-layer.component';
import { PortalFooterComponent } from '../view/footer/footer.component';
import { PortalHeaderComponent } from '../view/header/header.component';
import { GlobalMessagesComponent } from '../view/global-messages/global-messages.component';
import { OfferComponent } from '../view/offer/offer.component';
import { PasswordComponent } from '../view/forms/password/password.component';
import { DateComponent } from '../view/forms/date/date.component';
import { LastnameComponent } from '../view/forms/lastname/lastname.component';
import { NumberFieldComponent } from '../view/forms/number/number-field.component';
import { FirstnameComponent } from '../view/forms/firstname/firstname.component';
import { SelectFieldComponent } from '../view/forms/select/select-field.component';
import { RadioBtnComponent } from '../view/forms/radio/radio-btn.component';
import { VehicleRegFieldComponent } from '../view/forms/vehicle-reg/vehicle-reg.component';
import { HelpTextComponent } from '../view/help-text/help-text.component';
import { ScrollTopDirective } from '../directives/scroll-top.directive';
import { EmailComponent } from '../view/forms/email/email.component';

/**
 * Shared module that can be imported in by other modules.
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  declarations: [
    BrandImagePipe,
    BrandUrlPipe,
    CapitalizePipe,
    DataLayerComponent,
    PortalFooterComponent,
    PortalHeaderComponent,
    GlobalMessagesComponent,
    PasswordComponent,
    OfferComponent,
    PasswordComponent,
    FirstnameComponent,
    LastnameComponent,
    DateComponent,
    NumberFieldComponent,
    SelectFieldComponent,
    RadioBtnComponent,
    VehicleRegFieldComponent,
    HelpTextComponent,
    ScrollTopDirective,
    EmailComponent,
  ],
  providers: [
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    BrandImagePipe,
    BrandUrlPipe,
    CapitalizePipe,
    DataLayerComponent,
    PortalFooterComponent,
    PortalHeaderComponent,
    GlobalMessagesComponent,
    PasswordComponent,
    OfferComponent,
    PasswordComponent,
    FirstnameComponent,
    LastnameComponent,
    DateComponent,
    NumberFieldComponent,
    SelectFieldComponent,
    RadioBtnComponent,
    VehicleRegFieldComponent,
    HelpTextComponent,
    ScrollTopDirective,
    EmailComponent,
  ],
})
export class SharedModule { }
