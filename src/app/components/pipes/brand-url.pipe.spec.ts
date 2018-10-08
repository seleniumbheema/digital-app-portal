import { BrandUrlPipe } from './brand-url.pipe';

describe('Brand URL Pipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new BrandUrlPipe();

  it('should return localhost url for localhost brand url', () => {
    window['esure-env'].BRAND_URL = 'localhost';
    const result = pipe.transform('/aaa');
    expect(result).toEqual('http://localhost/aaa');
  });

  it('should set sub domain to www if prod url', () => {
    window['esure-env'].BRAND_URL = ESURE_GLOBALS.BRAND_CONFIG.brandUrl;
    const result = pipe.transform('/aaa');
    expect(result).toEqual(`https://www.${window['esure-env'].BRAND_URL}/aaa`);
  });

  it('should return the prod url if prod only is true', () => {
    window['esure-env'].BRAND_URL = 'localhost';
    const result = pipe.transform('/aaa', '', true);
    expect(result).toEqual(`https://www.${ESURE_GLOBALS.BRAND_CONFIG.brandUrl}/aaa`);
  });

  it('should set the sub domain if passed in', () => {
    window['esure-env'].BRAND_URL = 'localhost';
    const result = pipe.transform('/aaa', 'sub', false);
    expect(result).toEqual('http://sub.localhost/aaa');
  });
});
