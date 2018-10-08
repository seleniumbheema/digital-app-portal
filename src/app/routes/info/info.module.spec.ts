import { InfoModule } from './info.module';

describe('InfoModule', () => {

  let infoModule: InfoModule;

  it('should not throw an error if parent is null', () => {
    infoModule = new InfoModule(null);
    expect(infoModule).toBeTruthy();
  });

  it('should throw an error if parent is not null', () => {
    expect(() => { new InfoModule(new InfoModule(null)); }).toThrowError();
  });

});
