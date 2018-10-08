/**
 * Number utils helper class, all methods should be static.
 */
export class NumberUtils {

  /**
   * Pad a number with leading zeros if required, if the params 1, 2 are passed in, the final output will be the string 01.
   * @param num the number to add leading zeros to if required
   * @param size the final length the number should be
   */
  static pad(num, size): string {
    let s = `${num}`;
    while (s.length < size) {
      s = `0${s}`;
    }
    return s;
  }

  constructor() {
    throw new Error('NumberUtils class cannot be instantiated');
  }

}
