import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Subtract, expected: 0 },
  { a: 3, b: 2, action: Action.Multiply, expected: 6 },
  { a: 10, b: 2, action: Action.Divide, expected: 5 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 5, b: 0, action: Action.Divide, expected: Infinity },
  { a: 0, b: 0, action: Action.Exponentiate, expected: 1 },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'calculates $a $action $b = $expected',
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );

  test('should return null for invalid action', () => {
    expect(simpleCalculator({ a: 1, b: 2, action: '%' })).toBeNull();
  });

  test('should return null for non-number a', () => {
    expect(simpleCalculator({ a: '1', b: 2, action: Action.Add })).toBeNull();
  });

  test('should return null for non-number b', () => {
    expect(simpleCalculator({ a: 1, b: '2', action: Action.Add })).toBeNull();
  });

  test('should return null for completely invalid input', () => {
    expect(
      simpleCalculator({ a: null, b: undefined, action: 'invalid' }),
    ).toBeNull();
  });
});
