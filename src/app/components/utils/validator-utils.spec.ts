import { ValidatorUtils } from './validator-utils';

describe('ValidatorUtils', () => {

  it('should throw error if tried to be instantiated', () => {
    expect(() => new ValidatorUtils()).toThrow();
  });

  describe('getDateFieldValidators', () => {
    it('should return null if invalid control name passed in', () => {
      expect(ValidatorUtils.getDateFieldValidators('unknown')).toBeNull();
    });
  });

});
