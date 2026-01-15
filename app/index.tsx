import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, Platform, useColorScheme, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Display } from '../src/components/Display';
import { ButtonGrid } from '../src/components/ButtonGrid';
import { HistoryModal } from '../src/components/HistoryModal';
import { useCalculator } from '../src/hooks/useCalculator';
import { Colors } from '../src/constants/colors';
import { Stack } from 'expo-router';

export default function CalculatorApp() {
  const { displayValue, selectedOperator, handleInput, history, clearHistory } = useCalculator();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={theme.statusBar} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          style={styles.menuButton}
        >
          <Ionicons name="list" size={32} color={theme.buttonOperator} />
        </TouchableOpacity>
      </View>

      <HistoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        history={history}
        onClearHistory={clearHistory}
      />

      <View style={styles.content}>
        <Display value={displayValue} />
        <ButtonGrid
          onButtonPress={handleInput}
          selectedOperator={selectedOperator}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    alignItems: 'flex-start',
    zIndex: 1,
  },
  menuButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20, 
  },
});
