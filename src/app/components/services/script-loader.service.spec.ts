import { ScriptLoaderService, ScriptModel } from './script-loader.service';

describe('ScriptLoaderService', () => {

  const scriptLoaderService: ScriptLoaderService = new ScriptLoaderService();

  beforeAll(() => {
    const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
    const scripts: NodeListOf<HTMLScriptElement> = head.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i += 1) {
      head.removeChild(scripts[i]);
    }
  });

  it('should hit error block if script src is empty', (done) => {
    const script: ScriptModel = { name: 'SRC_EMPTY_TEST', src: '', loaded: false };
    scriptLoaderService.load(script).subscribe(
      () => fail('Should not come in here, as we are expecting error block to be hit'),
      ((error: string) => {
        expect(error).toBeNonEmptyString();
        done();
      }),
    );
  });

  it('should hit success block if script src has value', (done) => {
    const script: ScriptModel = {
      name: 'SUCCESS_SRC', src: '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
      loaded: false,
    };
    scriptLoaderService.load(script).subscribe(
      (model: ScriptModel) => {
        expect(model.loaded).toBeTrue();
        done();
      },
      () => fail('Should not come in here, as we are expecting success block to be hit'),
    );
  });

  it('should not load the same named script twice', (done) => {
    const script: ScriptModel = {
      name: 'DUPLICATE_SCRIPT_NAME', src: '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js', loaded: false,
    };
    scriptLoaderService.load(script).subscribe((model: ScriptModel) => {
      expect(model.loaded).toBeTrue();
      expect(model.name).toEqual('DUPLICATE_SCRIPT_NAME');
      scriptLoaderService.load(model).subscribe((returnModel: ScriptModel) => {
        expect(returnModel).toBe(model);
        done();
      });
    });
  });

  it('should load multiple differently named scripts', (done) => {
    const script1: ScriptModel = {
      name: 'DIFF_NAME_1', src: '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
      loaded: false, async: true,
    };
    const script2: ScriptModel = {
      name: 'DIFF_NAME_2', src: '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js', loaded: false, id: 'moment2',
      defer: true,
    };

    scriptLoaderService.load(script1).subscribe((model: ScriptModel) => {
      expect(model.loaded).toBeTrue();
      scriptLoaderService.load(script2).subscribe((model2: ScriptModel) => {
        expect(model2.loaded).toBeTrue();
        done();
      });
    });
  });
});
