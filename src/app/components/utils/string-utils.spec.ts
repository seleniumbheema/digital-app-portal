import { StringUtils } from './string-utils';

describe('StringUtils', () => {

  it('should throw error if tried to be instantiated', () => {
    expect(() => new StringUtils()).toThrow();
  });

  describe('sanitizeToAlpha', () => {
    it('should remove all non alpha characters', () => {
      const returnVal = StringUtils.sanitizeToAlpha('ABC123 DEF 456');
      expect(returnVal).toEqual('abcdef');
    });

    it('should return original value if null or any non truthy value', () => {
      const returnVal = StringUtils.sanitizeToAlpha(null);
      expect(returnVal).toBeNull();
    });
  });

  describe('removeWhitespaceAndMakeUppercase', () => {
    it('should remove all spaces and make uppercase', () => {
      const returnVal = StringUtils.removeWhitespaceAndMakeUppercase('abc 123x ');
      expect(returnVal).toEqual('ABC123X');
    });

    it('should return original value if null or any non truthy value', () => {
      const returnVal = StringUtils.removeWhitespaceAndMakeUppercase(null);
      expect(returnVal).toBeNull();
    });
  });

  describe('replaceWhiteSpaceWithChar', () => {
    it('should remove all spaces and replace with passed in char', () => {
      let returnVal = StringUtils.replaceWhiteSpaceWithChar('a b c', '_');
      expect(returnVal).toEqual('a_b_c');

      returnVal = StringUtils.replaceWhiteSpaceWithChar('a   b    c', '-');
      expect(returnVal).toEqual('a---b----c');
    });

    it('should return original value if null or any non truthy value', () => {
      const returnVal = StringUtils.replaceWhiteSpaceWithChar(null, null);
      expect(returnVal).toBeNull();
    });
  });
});
