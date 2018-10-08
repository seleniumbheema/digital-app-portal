import { PortalModule } from './portal.module';

describe('PortalModule', () => {

  let portalModule: PortalModule;

  it('should not throw an error if parent is null', () => {
    portalModule = new PortalModule(null);
    expect(portalModule).toBeTruthy();
  });

  it('should throw an error if parent is not null', () => {
    expect(() => { new PortalModule(new PortalModule(null)); }).toThrowError();
  });

});
