export type ButtonType = 'number' | 'operator' | 'function';

export interface ButtonConfig {
  label: string;
  value: string;
  type: ButtonType;
  span?: number;
}

export const buttonLayout: ButtonConfig[][] = [
  [
    { label: 'AC', value: 'clear', type: 'function' },
    { label: '+/-', value: 'negate', type: 'function' },
    { label: '%', value: 'percent', type: 'function' },
    { label: '÷', value: '/', type: 'operator' },
  ],
  [
    { label: '7', value: '7', type: 'number' },
    { label: '8', value: '8', type: 'number' },
    { label: '9', value: '9', type: 'number' },
    { label: '×', value: '*', type: 'operator' },
  ],
  [
    { label: '4', value: '4', type: 'number' },
    { label: '5', value: '5', type: 'number' },
    { label: '6', value: '6', type: 'number' },
    { label: '−', value: '-', type: 'operator' },
  ],
  [
    { label: '1', value: '1', type: 'number' },
    { label: '2', value: '2', type: 'number' },
    { label: '3', value: '3', type: 'number' },
    { label: '+', value: '+', type: 'operator' },
  ],
  [
    { label: '0', value: '0', type: 'number', span: 2 },
    { label: '.', value: '.', type: 'number' },
    { label: '=', value: '=', type: 'operator' },
  ],
];
