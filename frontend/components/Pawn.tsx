import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, sizes } from '../constants/theme';

type PawnProps = {
  position: [number, number];
  color: string;
  isCurrentPlayer: boolean;
};

export const Pawn: React.FC<PawnProps> = ({ position, color, isCurrentPlayer }) => {
  const [row, col] = position;
  
  const animatedStyle = useAnimatedStyle(() => {
    const cellSize = sizes.cellSize;
    const wallGap = sizes.wallGap;
    const totalCellSize = cellSize + wallGap;
    
    return {
      transform: [
        { 
          translateX: withSpring(col * totalCellSize + cellSize / 2, {
            damping: 15,
            stiffness: 150,
          })
        },
        { 
          translateY: withSpring(row * totalCellSize + cellSize / 2, {
            damping: 15,
            stiffness: 150,
          })
        },
        { 
          scale: withTiming(isCurrentPlayer ? 1.1 : 1, {
            duration: 200,
          })
        },
      ],
    };
  });

  return (
    <Animated.View 
      style={[
        styles.pawn, 
        { backgroundColor: color },
        isCurrentPlayer && styles.activePawn,
        animatedStyle,
      ]} 
    />
  );
};

const styles = StyleSheet.create({
  pawn: {
    position: 'absolute',
    width: sizes.pawnSize,
    height: sizes.pawnSize,
    borderRadius: sizes.pawnSize / 2,
    marginLeft: -sizes.pawnSize / 2,
    marginTop: -sizes.pawnSize / 2,
    borderWidth: 3,
    borderColor: colors.cream,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  activePawn: {
    borderColor: colors.goldLight,
    borderWidth: 4,
    shadowOpacity: 0.5,
    elevation: 12,
  },
});
