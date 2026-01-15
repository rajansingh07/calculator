import { calculate } from '../src/utils/calculator';

describe('Calculator Logic', () => {
  test('adds two numbers correctly', () => {
    expect(calculate('5', '3', '+')).toBe('8');
  });

  test('subtracts two numbers correctly', () => {
    expect(calculate('10', '4', '-')).toBe('6');
  });

  test('multiplies two numbers correctly', () => {
    expect(calculate('6', '7', '*')).toBe('42');
  });

  test('divides two numbers correctly', () => {
    expect(calculate('15', '3', '/')).toBe('5');
  });

  test('handles division by zero', () => {
    expect(calculate('10', '0', '/')).toBe('Error');
  });
});
