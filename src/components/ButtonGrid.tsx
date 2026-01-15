import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Button } from './Button';
import { buttonLayout, ButtonConfig } from '../constants/buttons';
import { Layout } from '../constants/layout';

interface ButtonGridProps {
  onButtonPress: (value: string) => void;
  selectedOperator: string | null;
}

export const ButtonGrid: React.FC<ButtonGridProps> = ({
  onButtonPress,
  selectedOperator,
}) => {
  const { width } = useWindowDimensions();
  const buttonSize = (width - Layout.screenPadding * 2 - Layout.buttonSpacing * 4) / 4;

  return (
    <View style={styles.container}>
      {buttonLayout.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((button: ButtonConfig) => (
            <Button
              key={button.value}
              label={button.label}
              onPress={() => onButtonPress(button.value)}
              type={button.type}
              size={buttonSize}
              width={button.span ? (buttonSize * button.span + Layout.buttonSpacing * (button.span - 1)) : undefined}
              isSelected={
                button.type === 'operator' && 
                button.value === selectedOperator
              }
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.screenPadding,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
