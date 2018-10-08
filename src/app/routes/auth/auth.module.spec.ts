import { AuthRoutesModule } from './auth.module';

describe('AuthRoutesModule', () => {

  let authRoutesModule: AuthRoutesModule;

  it('should not throw an error if parent is null', () => {
    authRoutesModule = new AuthRoutesModule(null);
    expect(authRoutesModule).toBeTruthy();
  });

  it('should throw an error if parent is not null', () => {
    expect(() => { new AuthRoutesModule(new AuthRoutesModule(null)); }).toThrowError();
  });

});
