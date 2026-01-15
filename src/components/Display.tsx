import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, useColorScheme } from 'react-native';
import { Colors } from '../constants/colors';
import { Layout } from '../constants/layout';

interface DisplayProps {
  value: string;
}

export const Display: React.FC<DisplayProps> = ({ value }) => {
  const { height } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const displayHeight = height * 0.35;
  
  return (
    <View style={[styles.container, { height: displayHeight }]}>
      <Text 
        style={[styles.text, { fontSize: displayHeight * 0.4, color: theme.display }]} 
        numberOfLines={1} 
        adjustsFontSizeToFit
      >
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: Layout.screenPadding * 2,
    paddingBottom: 20,
  },
  text: {
    fontWeight: '300',
  },
});
