import { CookieService } from 'ngx-cookie';

import { ScrollTopDirective } from './scroll-top.directive';
import { CustomerDataService } from '../services/customer-data.service';
import { BrandUrlPipe } from '../pipes/brand-url.pipe';

describe('ScrollTopDirective', () => {

  const cookieService = {
    get: (key: string) => { return key; },
  } as CookieService;
  const customerDataService = new CustomerDataService(null, cookieService, new BrandUrlPipe());
  const directive = new ScrollTopDirective(customerDataService);

  beforeAll(() => {
    directive.ngOnInit();
  });

  it('should handle window resize', () => {
    directive.onResize();
  });

  it('should handle window scroll with a target on the event', () => {
    const event = {
      target: {
        scrollTop: 0,
      },
    };
    directive.scrollToTop(event);
    expect(customerDataService.mobileScrollHidden).toBeTrue();
  });

  it('should handle window scroll with a srcElement on the event', () => {
    const event = {
      srcElement: {
        scrollTop: 0,
      },
    };
    directive.scrollToTop(event);
    expect(customerDataService.mobileScrollHidden).toBeTrue();
  });

});
