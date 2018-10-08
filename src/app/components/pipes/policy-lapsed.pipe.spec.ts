// import * as moment from 'moment';
import { PolicyLapsedPipe } from './policy-lapsed.pipe';

describe('PolicyLapsedPipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new PolicyLapsedPipe();

  const fakePolicyArray = [];

  beforeAll(() => {
    for (let i = 0; i < 9; i += 1) {

      fakePolicyArray.push({
        lapsed: (i % 2 === 0),
        type: 'home',
      });
    }
  });

  it('should return only lapsed policies when no argument is passed', () => {
    const lapsedPolicies = pipe.transform(fakePolicyArray);

    expect(lapsedPolicies.length).toBe(5);

    lapsedPolicies.forEach((policy) => {
      expect(policy.lapsed).toBeTruthy();
    });

  });

  it('should return only lapsed policies when set to true', () => {
    const lapsedPolicies = pipe.transform(fakePolicyArray, true);

    expect(lapsedPolicies.length).toBe(5);

    lapsedPolicies.forEach((policy) => {
      expect(policy.lapsed).toBeTruthy();
    });

  });

  it('should return only non-lapsed policies when set to false', () => {
    const lapsedPolicies = pipe.transform(fakePolicyArray, false);

    expect(lapsedPolicies.length).toBe(4);

    lapsedPolicies.forEach((policy) => {
      expect(policy.lapsed).toBeFalsy();
    });
  });

  it('should return the original value if the value is not set', () => {
    expect(pipe.transform(null)).toBe(null);
    expect(pipe.transform(undefined)).toBe(undefined);

    const emptyArrayResult = pipe.transform([]);
    expect(Array.isArray(emptyArrayResult)).toBeTruthy();
    expect(emptyArrayResult.length).toBe(0);
  });
});
