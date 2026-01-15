export const formatNumber = (value: string): string => {
  // Remove leading zeros except for decimal values
  if (value === '0') return '0';
  
  const number = parseFloat(value);
  
  if (isNaN(number)) return '0';
  
  // Handle very large or very small numbers with scientific notation
  if (Math.abs(number) >= 1e9 || (Math.abs(number) < 1e-6 && number !== 0)) {
    return number.toExponential(5);
  }
  
  // Format with appropriate decimal places
  const formatted = number.toString();
  
  // Limit display to 9 characters
  if (formatted.length > 9) {
    const precision = number.toPrecision(6);
    return precision.includes('.') ? precision.replace(/\.?0+$/, '') : precision;
  }
  
  return formatted;
};

export const removeTrailingZeros = (value: string): string => {
  if (!value.includes('.')) return value;
  return value.replace(/\.?0+$/, '');
};
