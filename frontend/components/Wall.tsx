import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, sizes } from '../constants/theme';

type WallProps = {
  type: 'h' | 'v';
  row: number;
  col: number;
  isPreview?: boolean;
};

export const Wall: React.FC<WallProps> = ({ type, row, col, isPreview }) => {
  const cellSize = sizes.cellSize;
  const wallGap = sizes.wallGap;
  const wallThickness = sizes.wallThickness;
  const totalCellSize = cellSize + wallGap;

  const wallStyle = {
    position: 'absolute' as const,
    backgroundColor: isPreview ? colors.gold : colors.wallActive,
    opacity: isPreview ? 0.6 : 1,
    ...(type === 'h' ? {
      width: cellSize * 2 + wallGap,
      height: wallThickness,
      left: col * totalCellSize,
      top: (row + 1) * totalCellSize - wallGap / 2 - wallThickness / 2,
    } : {
      width: wallThickness,
      height: cellSize * 2 + wallGap,
      left: (col + 1) * totalCellSize - wallGap / 2 - wallThickness / 2,
      top: row * totalCellSize,
    }),
  };

  return (
    <View style={[styles.wall, wallStyle]} />
  );
};

const styles = StyleSheet.create({
  wall: {
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});
