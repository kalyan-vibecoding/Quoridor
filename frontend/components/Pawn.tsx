import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, sizes } from '../constants/theme';

type PawnProps = {
  position: [number, number];
  color: string;
  isCurrentPlayer: boolean;
};

export const Pawn: React.FC<PawnProps> = ({ position, color, isCurrentPlayer }) => {
  const [row, col] = position;
  
  const cellSize = sizes.cellSize;
  const wallGap = sizes.wallGap;
  const totalCellSize = cellSize + wallGap;

  const pawnStyle = {
    left: col * totalCellSize + cellSize / 2 - sizes.pawnSize / 2,
    top: row * totalCellSize + cellSize / 2 - sizes.pawnSize / 2,
  };

  // Use different dinosaur emojis for different colors
  const getDinoEmoji = () => {
    if (color === colors.player1) return '🦕'; // Blue player - Sauropod (long neck dino)
    return '🦖'; // Red player - T-Rex
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
      <Text style={styles.emoji}>{getDinoEmoji()}</Text>
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
    fontSize: 18,
    textAlign: 'center',
  },
});
