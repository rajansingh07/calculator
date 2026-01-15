import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  useColorScheme,
  Dimensions,
  PanResponder
} from 'react-native';
import { Colors } from '../constants/colors';
import { HistoryItem } from '../types/history.types';

interface HistoryModalProps {
  visible: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClearHistory: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// Two snap points: 50% from top (half) and 10% from top (full)
const SNAP_POINTS = {
  HALF: SCREEN_HEIGHT * 0.5,
  FULL: SCREEN_HEIGHT * 0.1,  // 10% from top (90% height)
  HIDDEN: SCREEN_HEIGHT
};

export const HistoryModal: React.FC<HistoryModalProps> = ({
  visible,
  onClose,
  history,
  onClearHistory,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  // Animated value for Y position of the sheet
  const displayAnim = useRef(new Animated.Value(SNAP_POINTS.HIDDEN)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate open to HALF position
      Animated.parallel([
        Animated.spring(displayAnim, {
          toValue: SNAP_POINTS.HALF,
          useNativeDriver: true,
          bounciness: 4,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate close to HIDDEN position
      Animated.parallel([
        Animated.timing(displayAnim, {
          toValue: SNAP_POINTS.HIDDEN,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Current logical position to track drag deltas
  const currentPosition = useRef(SNAP_POINTS.HIDDEN);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
         // Only handle vertical movement
         return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        displayAnim.stopAnimation((value) => {
           currentPosition.current = value;
        });
      },
      onPanResponderMove: (_, gestureState) => {
        // Calculate new position based on gesture delta
        let newY = currentPosition.current + gestureState.dy;
        
        // Add resistance if pulling up beyond FULL point
        if (newY < SNAP_POINTS.FULL) {
           newY = SNAP_POINTS.FULL - (SNAP_POINTS.FULL - newY) * 0.2;
        }

        displayAnim.setValue(newY);
      },
      onPanResponderRelease: (_, gestureState) => {
        const endY = currentPosition.current + gestureState.dy;
        
        // Velocity threshold for flicks
        if (gestureState.vy > 0.5) {
           // Flick down -> Close
           animateTo(SNAP_POINTS.HIDDEN, true);
        } else if (gestureState.vy < -0.5) {
           // Flick up -> Full screen
           animateTo(SNAP_POINTS.FULL);
        } else {
           // Snap to nearest
           const distToHalf = Math.abs(endY - SNAP_POINTS.HALF);
           const distToFull = Math.abs(endY - SNAP_POINTS.FULL);
           const distToHidden = Math.abs(endY - SNAP_POINTS.HIDDEN);
           
           if (distToHidden < 200) { // If dragged very close to bottom
             animateTo(SNAP_POINTS.HIDDEN, true);
           } else if (distToFull < distToHalf) {
             animateTo(SNAP_POINTS.FULL);
           } else {
             animateTo(SNAP_POINTS.HALF);
           }
        }
      },
    })
  ).current;
  
  const animateTo = (toValue: number, close: boolean = false) => {
    Animated.spring(displayAnim, {
      toValue,
      useNativeDriver: true,
      bounciness: 2,
    }).start(({ finished }) => {
      if (finished && close) {
         currentPosition.current = SNAP_POINTS.HIDDEN; // Reset logical position
         onClose();
      } else if (finished) {
         currentPosition.current = toValue; // Update logical position
      }
    });
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={[styles.historyItem, { borderBottomColor: theme.buttonPressedNumber }]}>
      <Text style={[styles.expressionText, { color: theme.textNumber }]}>
        {item.expression}
      </Text>
      <Text style={[styles.resultText, { color: theme.buttonOperator }]}>
        = {item.result}
      </Text>
    </View>
  );

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
    >
      <View style={styles.overlayContainer}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        >
          <Animated.View 
            style={[
              styles.backdropContent, 
              { opacity: overlayAnim }
            ]} 
          />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.sheet,
            { 
              backgroundColor: theme.background,
              transform: [{ translateY: displayAnim }],
              height: SCREEN_HEIGHT,
              shadowColor: theme.textNumber,
            },
          ]}
        >
          {/* Drag Handle Area */}
          <View {...panResponder.panHandlers} style={styles.handleContainer}>
            <View style={[styles.dragHandle, { backgroundColor: theme.buttonFunction }]} />
          </View>

          <View style={styles.contentContainer}>
            {history.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.textNumber }]}>
                  No history yet
                </Text>
              </View>
            ) : (
              <FlatList
                data={history}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            )}

            {history.length > 0 && (
              <View style={styles.footer}>
                <TouchableOpacity
                  style={[styles.clearButton, { backgroundColor: theme.buttonFunction }]}
                  onPress={onClearHistory}
                >
                  <Text style={[styles.clearButtonText, { color: theme.textNumber }]}>
                    Clear History
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Spacer for bottom safe area */}
            <View style={{ height: 100 }} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropContent: {
    flex: 1,
    backgroundColor: '#000',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0, 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  handleContainer: {
    paddingVertical: 15,
    alignItems: 'center',
    width: '100%',
    zIndex: 10,
    // Increase hit slop area for draggable handle
    paddingBottom: 25,
    marginBottom: -10,
  },
  dragHandle: {
    width: 60,
    height: 6,
    borderRadius: 3,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  expressionText: {
    fontSize: 18,
    marginBottom: 4,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  footer: {
    padding: 16,
  },
  clearButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
