import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie';
import * as moment from 'moment';

import { HttpService, HttpErrorModel } from './http.service';
import { Customer } from '../../models/customer';
import { Offer } from '../../models/offer';
import { BrandUrlPipe } from '../pipes/brand-url.pipe';
import { CUSTOMER_STATUS_LOCAL_STORAGE_KEY_NAME } from '../auth/auth.module';
import * as AUTH_INTERFACES from '../../components/auth/auth.interface';

const routerAnimatingClass = 'routerAnimating';

interface LastError {
  error: any;
  extraInfo: string;
  browserInfo?: string;
}

@Injectable()
export class CustomerDataService {

  /**
   * Brand config.
   */
  private brandConfig = ESURE_GLOBALS.BRAND_CONFIG;

  private lastError: LastError;

  /* Motor Offer(s)
  **/
  private motorOfferTemplate = {
    class: 'motor',
    heading: 'Save 10% on our Car Insurance',
    url: this.brandUrlPipe.transform('/car10'),
    info: this.brandUrlPipe.transform('/car10'),
    content: 'Plus, get a courtesy car for the whole time your car’s being repaired with an approved garage.',
    enabled: true,
  };

  private motorOffers = {
    login: {
      ...this.motorOfferTemplate,
      icon: true,
    },
    special: {
      ...this.motorOfferTemplate,
      icon: true,
      heading: '10% loyalty discount on Car Insurance',
      content: 'Plus, if you ever have an accident you’ll get a courtesy car from the recommended garage while your car’s being repaired.',
    },
    dynamic: {
      ...this.motorOfferTemplate,
      heading: 'Your 10% Car Insurance saving',
      content: 'Loyal customers like you get value for money and reassuring cover – including a courtesy car when you use an approved repairer.',
    },
  };

  /* Home Offer(s)
  **/
  private homeOfferTemplate = {
    class: 'home-one',
    heading: 'Home Insurance',
    url: this.brandUrlPipe.transform('/home10'),
    info: this.brandUrlPipe.transform('/home10'),
    enabled: true,
  };

  private homeOffers = {
    login: {
      ...this.homeOfferTemplate,
      class: 'home',
      heading: 'Quality, reassuring Home Insurance',
      content: 'Defaqto has rated our insurance 5-Star, meaning it has a comprehensive level of features and benefits.',
      icon: true,
    },
    timeout: {
      ...this.homeOfferTemplate,
      content: 'Our quality cover includes up to 15% extra contents cover for special events like weddings or births.',
    },
    special: {
      ...this.homeOfferTemplate,
      heading: 'Our loyal customers save up to 10%',
      content: 'Our quality Home Insurance offers great value and peace of mind.',
      icon: true,
    },
    dynamic: {
      ...this.homeOfferTemplate,
      class: 'home',
      content: 'Our quality cover comes with the reassurance of unlimited buildings cover and new for old contents cover.',
    },
  };

  /* Multicar Offer(s)
  **/
  private multicarOfferTemplate = {
    class: 'multicar-one',
    heading: 'Our customers save 10%',
    url: this.brandUrlPipe.transform('/multicar10'),
    info: this.brandUrlPipe.transform('/multicar10'),
    enabled: true,
  };

  private multicarOffers = {
    login: {
      ...this.multicarOfferTemplate,
      content: `Our quality Multicar Insurance offers great value and peace of mind. Cover includes 10% off each extra
       car insured by you, your partner or anyone else over 25 living at home.`,
      icon: true,
    },
    timeout: {
      ...this.multicarOfferTemplate,
      heading: 'Multicar Insurance',
      content: 'Our quality cover offers convenient separate policies for each car – so a claim on one won’t affect the other.',
    },
    special: {
      ...this.multicarOfferTemplate,
      heading: 'All yours – 10% off Multicar Insurance',
      content: 'That’s what you get off your quote if you, your partner or anyone over 25 who lives with you insures a car with us too.',
      icon: true,
    },
    dynamic: {
      ...this.multicarOfferTemplate,
      class: 'multicar',
      content: `Get a bundle of benefits when you choose ${this.brandConfig.brandName} Multicar`,
    },
  };

  /* Travel Offer(s)
  **/
  private travelOfferTemplate = {
    class: 'travel',
    heading: 'Travel Insurance',
    url: this.brandUrlPipe.transform('/travel-insurance'),
    info: this.brandUrlPipe.transform('/travel-insurance'),
    enabled: true,
  };

  private travelOffers = {
    login: {
      ...this.travelOfferTemplate,
      heading: 'Travel Insurance peace of mind',
      content: `Everyone deserves a holiday – and quality travel cover. Ours has 24-hour Emergency Medical Assistance,
       Emergency medical cover up to £20,000,000 per person and Baggage cover up to £2,500.`,
    },
    timeout: {
      ...this.travelOfferTemplate,
      content: 'Whether you’re travelling in Europe or Worldwide, trust us for value-for-money cover.',
    },
    special: {
      ...this.travelOfferTemplate,
      heading: 'Travel Insurance online discount – up to 20%',
      content: `Looking for value-for-money and reassuring cover? Ours has 24-hour Emergency Medical Assistance –
       meaning help is just a phone call away.`,
      icon: true,
    },
    dynamic: {
      ...this.travelOfferTemplate,
      content: 'With our quality cover, you’ll have peace of mind with 24-hour Emergency Medical Assistance.',
      home: {
        ...this.travelOfferTemplate,
        content: 'Our flexible insurance offers 3 levels of cover, plus European and Worldwide options.',
      },
    },
  };

  /* istanbul ignore next */
  public sideBar: SidebarModel = {
    opened: false,
    autoCollapseWidth: 1023,
    fixedNav: false,
    navStyle: 'over',
    toggle: () => {
      return (!this.sideBar.fixedNav) ?
        this.sideBar.opened = !this.sideBar.opened :
        false;
    },
  };

  /**
   * Whether the scroll to top button appears or not. Set to true by default as hidden until page scrolls down more than the window height.
   * @type {boolean}
   */
  public mobileScrollHidden: boolean = true;

  /**
   * Customer property.
   * @type {Customer}
   */
  public customer: Customer;

  /**
   * Whether the cookie bar is hidden or not. Setting this to true will cause the cookie bar to animate out of view.
   * @type {boolean}
   */
  public cookieBarHidden: boolean;

  /**
   * Whether the browser version warning bar is hidden or not. Setting this to true will cause the warning bar to animate out of view.
   * @type {boolean}
   */
  public browserWarningHidden: boolean;

  /**
   * Whether animations are disabled or not. Setting to true for e2e tests speeds up tests and less flake.
   * @type {boolean}
   */
  public animationsDisabled: boolean = ESURE_GLOBALS.ENDTOEND;

  /**
   * Name of the cookie, this should match with the name on the static sites.
   * Quote and buy uses cookie name of sliderStatus, so customers could still see the cookie bar on there
   * @type {string}
   */
  private cookieNameForCookieBarSeen = 'cookie-agreed';

  /**
   * Name of the cookie, this should match with the name on the static sites.
   * Quote and buy uses cookie name of sliderStatus, so customers could still see the cookie bar on there
   * @type {string}
   */
  private cookieNameForWarningBarSeen = 'browser-warning-agreed';

  /**
   * Constructor to inject in any required dependencies.
   * @param {HttpService} httpService
   * @param {CookieService} cookieService
   * @param {BrandUrlPipe} brandUrlPipe
   */
  constructor(
    private httpService: HttpService,
    private cookieService: CookieService,
    private brandUrlPipe: BrandUrlPipe,
  ) {
    this.cookieBarHidden = this.cookieService.get(this.cookieNameForCookieBarSeen) !== undefined;
    this.browserWarningHidden = this.cookieService.get(this.cookieNameForWarningBarSeen) !== undefined;
  }

  /**
   * Sets the customer instance on this class, this will be called by the CustomerResolver.
   * @return {Observable<Customer>}
   */
  public setCustomer(): Observable<Customer> {
    return this.httpService.get('/customer').pipe(
      map(accountDetails => new Customer(accountDetails)),
      tap((customer: Customer) => {
        this.customer = customer;
        localStorage.setItem(CUSTOMER_STATUS_LOCAL_STORAGE_KEY_NAME, this.customer.id);
      }));
  }

  /* istanbul ignore next */
  public changePassword(passwordDetails: AUTH_INTERFACES.ChangePasswordCredentials): Observable<object> {
    // TODO: specify return type interface once known
    return this.httpService.post<object>('/customer/change-password', passwordDetails);
  }

  /* istanbul ignore next */
  public changeEmail(emailDetails: AUTH_INTERFACES.ChangeUserNameDetails): Observable<object> {
    // TODO: specify return type interface once known
    return this.httpService.post<object>('/customer/change-email', emailDetails);
  }

  public logError(): Observable<void | HttpErrorModel> {
    return this.httpService.post<void>('/error', this.getLastError());
  }

  /**
   * If the cookie bar isn't already hidden, this will set it to be hidden.
   */
  public updateCookieBar(): void {
    if (this.cookieService.get(this.cookieNameForCookieBarSeen) === undefined) {
      const expiry = moment.utc().add(1, 'year'); // Keep the cookie for 1 year
      this.cookieService.put(this.cookieNameForCookieBarSeen, '2', { expires: expiry.toDate(), secure: false });
      this.cookieBarHidden = true;
    }
  }

  /**
   * If the browser version warning bar isn't already hidden, this will set it to be hidden.
   */
  public updateBrowserWarningBar(): void {
    if (this.cookieService.get(this.cookieNameForWarningBarSeen) === undefined) {
      const expiry = moment.utc().add(1, 'year'); // Keep the cookie for 1 year
      this.cookieService.put(this.cookieNameForWarningBarSeen, 'true', { expires: expiry.toDate(), secure: false });
      this.browserWarningHidden = true;
    }
  }

  /* istanbul ignore next */
  public initSidebar(currentWindowWidth: number): void {
    if (currentWindowWidth > this.sideBar.autoCollapseWidth) {
      this.sideBar = {
        ...this.sideBar,
        navStyle: 'slide',
        fixedNav: true,
        opened: true,
      };
    } else {
      this.sideBar = {
        ...this.sideBar,
        navStyle: 'over',
        fixedNav: false,
        opened: false,
      };
    }
  }

  /* istanbul ignore next */
  public getDynamicOffers() {
    const dynOffers: Offer[] = [];
    if (!this.isFirstAlternative()) {
      if (this.customer.crossSell && this.customer.crossSell.length > 0) {
        // TODO: This assumes the array will only ever contain one item, as we always take the first item
        // Which one should we take if the array returned two items. e.g home and motor which according to the API it could
        switch (this.customer.crossSell[0].name) {
          case 'motor':
            dynOffers.push(this.motorOffers.dynamic, this.travelOffers.dynamic);
            break;
          case 'home':
            dynOffers.push(this.homeOffers.dynamic, this.travelOffers.dynamic.home);
            break;
          case 'multi-car':
            dynOffers.push(this.multicarOffers.dynamic, this.travelOffers.dynamic);
            break;
          default:
            break;
        }
      } else {
        dynOffers.push(this.travelOffers.dynamic);
      }
    }

    return dynOffers;
  }

  public getLogoutOffers(): Offer[] {
    const offers: Offer[] = [];
    if (!this.isFirstAlternative()) {
      offers.push(this.travelOffers.login);
    }
    return offers;
  }

  public getTimeoutOffers(): Offer[] {
    const offers: Offer[] = [];
    if (!this.isFirstAlternative()) {
      offers.push(this.multicarOffers.timeout, this.travelOffers.timeout, this.homeOffers.timeout);
    }
    return offers;
  }

  public getLoginOffers(): Offer[] {
    const offers: Offer[] = [];
    if (!this.isFirstAlternative()) {
      offers.push(this.motorOffers.login, this.multicarOffers.login, this.homeOffers.login);
    }
    return offers;
  }

  public getSpecialOffers(): Offer[] {
    const offers: Offer[] = [];
    offers.push(this.multicarOffers.special, this.homeOffers.special, this.motorOffers.special, this.travelOffers.special);
    return offers;
  }

  /**
   * Run when a router animation starts, adds a class called routerAnimating to the body.
   */
  public onRouterAnimationStart(): void {
    document.body.classList.add(routerAnimatingClass);
  }

  /**
   * Run when a router animation is completed, removes the routerAnimating class from the body.
   */
  public onRouterAnimationDone(): void {
    document.body.classList.remove(routerAnimatingClass);
  }

  public getLastError(): LastError {
    return this.lastError;
  }

  public clearLastError(): void {
    this.lastError = undefined;
  }

  public setLastError(inError: any, extraInfo?: string): void {
    let error = inError;
    if (inError && typeof inError === 'string') {
      error = error.slice(0, 2500);
    } else if (inError && inError instanceof Error) {
      error = {
        message: inError.message,
        name: inError.name,
        ...inError.stack && {
          stack: inError.stack.slice(0, 2500),
        },
      };
    }
    this.lastError = {
      error,
      extraInfo,
    };
  }

  private isFirstAlternative(): boolean {
    return this.brandConfig.brandCode === 'FA';
  }
}

/**
 * Interface to describe the properties a sidebar should have.
 */
export interface SidebarModel {

  /** Whether the sidebar is open. */
  opened: boolean;

  /** Window width in pixels in which to automatically close the sidebar. */
  autoCollapseWidth: number;

  /** The way the sidebar is opened. */
  navStyle: 'slide' | 'push' | 'over';

  /** Navigation fixed on desktop to help nav events. */
  fixedNav: boolean;

  /** Method to run to toggle the sidebar open or closed. */
  toggle(): void;
}
