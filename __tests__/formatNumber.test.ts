import { formatNumber, removeTrailingZeros } from '../src/utils/formatNumber';

describe('Number Formatting', () => {
  test('formats regular numbers correctly', () => {
    expect(formatNumber('123')).toBe('123');
  });

  test('removes trailing zeros from decimals', () => {
    expect(removeTrailingZeros('5.00')).toBe('5');
    expect(removeTrailingZeros('3.50')).toBe('3.5');
  });

  test('handles scientific notation for large numbers', () => {
    const result = formatNumber('1000000000');
    expect(result).toContain('e');
  });
});
