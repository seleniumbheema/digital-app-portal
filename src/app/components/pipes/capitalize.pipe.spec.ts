import { CapitalizePipe } from './capitalize.pipe';

describe('CapitalizePipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new CapitalizePipe();

  it('should capitalize a varitey of strings', () => {
    const testStrings = [
      { input: 'single', output: 'Single' },
      { input: 'two words', output: 'Two words' },
      { input: 'hypened-words', output: 'Hypened-words' },
    ];

    let pipeOutput;

    testStrings.forEach((str) => {
      pipeOutput = pipe.transform(str.input);
      expect(pipeOutput).toBe(str.output);
    });
  });

  it('should return the original value if the first character is not a letter', () => {
    const testStrings = [
      '"quoted"',
      '123abc',
      '!test',
      '',
    ];

    let pipeOutput;

    testStrings.forEach((str) => {
      pipeOutput = pipe.transform(str);
      expect(pipeOutput).toBe(str);
    });
  });

  it('should return the original value if the value is not set', () => {
    expect(pipe.transform(null)).toBe(null);
    expect(pipe.transform(undefined)).toBe(undefined);
  });
});
