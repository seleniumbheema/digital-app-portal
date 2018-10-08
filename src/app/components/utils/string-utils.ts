/**
 * String utils helper class, all methods should be static.
 */
export class StringUtils {

  /**
   * Sanitizes an input by removing any non alpha characters, including whitespace and making the input lowercase.
   *
   * @static
   * @param {string} str
   * @returns {string}
   * @memberof StringUtils
   */
  static sanitizeToAlpha(str: string): string {
    return str ? str.toLowerCase().replace(/[^a-z]*/g, '') : str;
  }

  /**
   * Removes all whitespace and uppercases the string.
   *
   * @static
   * @param {string} str
   * @returns {string}
   * @memberof StringUtils
   */
  static removeWhitespaceAndMakeUppercase(str: string): string {
    return str ? str.toUpperCase().replace(/\s/g, '') : str;
  }

  /**
   * Replaces any whitespace with the specified replacement char.
   *
   * @static
   * @param {string} str
   * @param {string} replacementChar
   * @returns {string}
   * @memberof StringUtils
   */
  static replaceWhiteSpaceWithChar(str: string, replacementChar: string): string {
    return str ? str.replace(/ /g, replacementChar) : str;
  }

  constructor() {
    throw new Error('StringUtils class cannot be instantiated');
  }

}
