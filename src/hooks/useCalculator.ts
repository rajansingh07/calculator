import { useReducer, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalculatorState, CalculatorAction } from '../types/calculator.types';
import { HistoryItem } from '../types/history.types';
import { calculate } from '../utils/calculator';
import { formatNumber } from '../utils/formatNumber';

const HISTORY_STORAGE_KEY = '@calculator_history';

const initialState: CalculatorState = {
  currentValue: '0',
  previousValue: '',
  operator: null,
  shouldResetDisplay: false,
};

const calculatorReducer = (
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState => {
  switch (action.type) {
    case 'NUMBER_INPUT': {
      if (state.shouldResetDisplay) {
        return {
          ...state,
          currentValue: action.payload,
          shouldResetDisplay: false,
        };
      }

      if (state.currentValue === '0') {
        return { ...state, currentValue: action.payload };
      }

      if (state.currentValue.length >= 9) {
        return state;
      }

      return {
        ...state,
        currentValue: state.currentValue + action.payload,
      };
    }

    case 'DECIMAL': {
      if (state.shouldResetDisplay) {
        return {
          ...state,
          currentValue: '0.',
          shouldResetDisplay: false,
        };
      }

      if (state.currentValue.includes('.')) {
        return state;
      }

      return {
        ...state,
        currentValue: state.currentValue + '.',
      };
    }

    case 'OPERATOR_INPUT': {
      if (state.operator && !state.shouldResetDisplay) {
        const result = calculate(
          state.previousValue,
          state.currentValue,
          state.operator
        );

        return {
          currentValue: formatNumber(result),
          previousValue: formatNumber(result),
          operator: action.payload,
          shouldResetDisplay: true,
        };
      }

      return {
        ...state,
        previousValue: state.currentValue,
        operator: action.payload,
        shouldResetDisplay: true,
      };
    }

    case 'EQUALS': {
      if (!state.operator || !state.previousValue) {
        return state;
      }

      const result = calculate(
        state.previousValue,
        state.currentValue,
        state.operator
      );

      return {
        currentValue: formatNumber(result),
        previousValue: '',
        operator: null,
        shouldResetDisplay: true,
      };
    }

    case 'CLEAR': {
      return initialState;
    }

    case 'NEGATE': {
      if (state.currentValue === '0') return state;

      const negated = (parseFloat(state.currentValue) * -1).toString();
      return { ...state, currentValue: formatNumber(negated) };
    }

    case 'PERCENT': {
      const percentage = (parseFloat(state.currentValue) / 100).toString();
      return { ...state, currentValue: formatNumber(percentage) };
    }

    default:
      return state;
  }
};

export const useCalculator = () => {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load history', error);
    }
  };

  const saveHistory = async (newHistory: HistoryItem[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Failed to save history', error);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history', error);
    }
  };

  const addToHistory = (prev: string, curr: string, op: string, result: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      expression: `${prev} ${op} ${curr}`,
      result,
      timestamp: Date.now(),
    };
    saveHistory([newItem, ...history]);
  };

  const handleInput = (value: string) => {
    if (value >= '0' && value <= '9') {
      dispatch({ type: 'NUMBER_INPUT', payload: value });
    } else if (value === '.') {
      dispatch({ type: 'DECIMAL' });
    } else if (['+', '-', '*', '/'].includes(value)) {
      if (state.operator && !state.shouldResetDisplay) {
         // Auto-calculate if operator is pressed again
         const result = formatNumber(calculate(state.previousValue, state.currentValue, state.operator));
         addToHistory(state.previousValue, state.currentValue, state.operator, result);
      }
      dispatch({ type: 'OPERATOR_INPUT', payload: value });
    } else if (value === '=') {
      if (state.operator && state.previousValue) {
        const result = formatNumber(calculate(state.previousValue, state.currentValue, state.operator));
        addToHistory(state.previousValue, state.currentValue, state.operator, result);
      }
      dispatch({ type: 'EQUALS' });
    } else if (value === 'clear') {
      dispatch({ type: 'CLEAR' });
    } else if (value === 'negate') {
      dispatch({ type: 'NEGATE' });
    } else if (value === 'percent') {
      dispatch({ type: 'PERCENT' });
    }
  };

  return {
    displayValue: state.currentValue,
    selectedOperator: state.operator,
    handleInput,
    history,
    clearHistory,
  };
};
