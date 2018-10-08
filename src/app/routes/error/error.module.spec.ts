import { ErrorModule } from './error.module';

describe('ErrorModule', () => {

  let errorModule: ErrorModule;

  it('should not throw an error if parent is null', () => {
    errorModule = new ErrorModule(null);
    expect(errorModule).toBeTruthy();
  });

  it('should throw an error if parent is not null', () => {
    expect(() => { new ErrorModule(new ErrorModule(null)); }).toThrowError();
  });

});
