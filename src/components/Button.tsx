import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';
import { Layout } from '../constants/layout';
import { ButtonType } from '../constants/buttons';

interface ButtonProps {
  label: string;
  onPress: () => void;
  type: ButtonType;
  width?: number; // Optional override for width
  size: number;   // Base button size
  isSelected?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  type,
  width,
  size,
  isSelected = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const getBackgroundColor = () => {
    if (isPressed) {
      if (type === 'operator') return theme.buttonPressedOperator;
      if (type === 'function') return theme.buttonPressedFunction;
      return theme.buttonPressedNumber;
    }
    if (isSelected) {
      return theme.textOperator; // Usually white, acts as inverted background
    }
    if (type === 'operator') return theme.buttonOperator;
    if (type === 'function') return theme.buttonFunction;
    return theme.buttonNumber;
  };

  const getTextColor = () => {
    if (isSelected) return theme.buttonOperator;
    if (type === 'function') return theme.textFunction;
    if (type === 'operator') return theme.textOperator;
    return theme.textNumber;
  };

  const handlePressIn = () => {
    setIsPressed(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    setIsPressed(false);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          width: width || size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Text style={[styles.text, { color: getTextColor(), fontSize: size * 0.45 }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: Layout.buttonSpacing / 2,
  },
  text: {
    fontWeight: '400',
  },
});
