import { AuthComponentModule } from './auth.module';

describe('AuthComponentModule', () => {

  let authComponentModule: AuthComponentModule;

  it('should not throw an error if parent is null', () => {
    authComponentModule = new AuthComponentModule(null);
    expect(authComponentModule).toBeTruthy();
  });

  it('should throw an error if parent is not null', () => {
    expect(() => { new AuthComponentModule(new AuthComponentModule(null)); }).toThrowError();
  });

});
