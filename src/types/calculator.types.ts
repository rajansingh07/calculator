export interface CalculatorState {
  currentValue: string;
  previousValue: string;
  operator: string | null;
  shouldResetDisplay: boolean;
}

export type CalculatorAction =
  | { type: 'NUMBER_INPUT'; payload: string }
  | { type: 'OPERATOR_INPUT'; payload: string }
  | { type: 'EQUALS' }
  | { type: 'CLEAR' }
  | { type: 'NEGATE' }
  | { type: 'PERCENT' }
  | { type: 'DECIMAL' };
