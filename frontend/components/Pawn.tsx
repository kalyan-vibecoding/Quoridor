import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, sizes } from '../constants/theme';

type PawnProps = {
  position: [number, number];
  color: string;
  isCurrentPlayer: boolean;
  emoji: string;
};

export const Pawn: React.FC<PawnProps> = ({ position, color, isCurrentPlayer, emoji }) => {
  const [row, col] = position;
  
  const cellSize = sizes.cellSize;
  const wallGap = sizes.wallGap;
  const totalCellSize = cellSize + wallGap;

  const pawnStyle = {
    left: col * totalCellSize + cellSize / 2 - sizes.pawnSize / 2,
    top: row * totalCellSize + cellSize / 2 - sizes.pawnSize / 2,
  };

  return (
    <View 
      style={[
        styles.pawn, 
        { 
          backgroundColor: color,
          borderColor: isCurrentPlayer ? colors.goldLight : colors.cream,
          borderWidth: isCurrentPlayer ? 4 : 3,
          transform: [{ scale: isCurrentPlayer ? 1.1 : 1 }],
        },
        pawnStyle,
      ]} 
    >
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pawn: {
    position: 'absolute',
    width: sizes.pawnSize,
    height: sizes.pawnSize,
    borderRadius: sizes.pawnSize / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
});
