export const calculate = (
  previousValue: string,
  currentValue: string,
  operator: string
): string => {
  const prev = parseFloat(previousValue);
  const current = parseFloat(currentValue);

  if (isNaN(prev) || isNaN(current)) return currentValue;

  let result: number;

  switch (operator) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      if (current === 0) return 'Error';
      result = prev / current;
      break;
    default:
      return currentValue;
  }

  return result.toString();
};
