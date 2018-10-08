import { NumberUtils } from './number-utils';

describe('NumberUtils', () => {

  it('should throw error if tried to be instantiated', () => {
    expect(() => new NumberUtils()).toThrow();
  });

  describe('pad', () => {
    it('should pad with leading zeros', () => {
      let returnVal = NumberUtils.pad(1, 2);
      expect(returnVal).toEqual('01');
      returnVal = NumberUtils.pad(70, 2);
      expect(returnVal).toEqual('70');
    });
  });
});
