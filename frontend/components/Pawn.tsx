import React from 'react';
import { View, StyleSheet } from 'react-native';
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

  return (
    <View 
      style={[
        styles.pawn, 
        { backgroundColor: color },
        isCurrentPlayer && styles.activePawn,
        pawnStyle,
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
    transform: [{ scale: 1.1 }],
  },
});
