import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { colors, sizes } from '../constants/theme';
import { Pawn } from './Pawn';
import { Wall } from './Wall';

type Position = [number, number];
type WallType = { type: 'h' | 'v'; row: number; col: number };

type GameBoardProps = {
  player1Pos: Position;
  player2Pos: Position;
  player1Emoji: string;
  player2Emoji: string;
  walls: WallType[];
  wallPreview: WallType | null;
  selectedCell: Position | null;
  validMoves: Position[];
  placingWall: boolean;
  currentPlayer: 0 | 1;
  onCellPress: (row: number, col: number) => void;
  onWallSlotPress: (type: 'h' | 'v', row: number, col: number) => void;
};

export const GameBoard: React.FC<GameBoardProps> = ({
  player1Pos,
  player2Pos,
  player1Emoji,
  player2Emoji,
  walls,
  wallPreview,
  selectedCell,
  validMoves,
  placingWall,
  currentPlayer,
  onCellPress,
  onWallSlotPress,
}) => {
  const cellSize = sizes.cellSize;
  const wallGap = sizes.wallGap;
  const boardSize = cellSize * 9 + wallGap * 8;

  const isValidMove = (row: number, col: number) => {
    return validMoves.some(([r, c]) => r === row && c === col);
  };

  const isWallPlaced = (type: 'h' | 'v', row: number, col: number) => {
    return walls.some(w => w.type === type && w.row === row && w.col === col);
  };

  return (
    <View style={[styles.container, { width: boardSize, height: boardSize }]}>
      {/* Grid Cells */}
      {Array.from({ length: 9 }).map((_, row) =>
        Array.from({ length: 9 }).map((_, col) => {
          const isHighlighted = isValidMove(row, col);
          const isSelected = selectedCell?.[0] === row && selectedCell?.[1] === col;
          
          return (
            <TouchableOpacity
              key={`cell-${row}-${col}`}
              style={[
                styles.cell,
                {
                  width: cellSize,
                  height: cellSize,
                  left: col * (cellSize + wallGap),
                  top: row * (cellSize + wallGap),
                },
                isHighlighted && styles.highlightedCell,
                isSelected && styles.selectedCell,
              ]}
              onPress={() => !placingWall && onCellPress(row, col)}
              disabled={placingWall}
            />
          );
        })
      )}

      {/* Horizontal Wall Slots */}
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => {
          const placed = isWallPlaced('h', row, col);
          
          return (
            <TouchableOpacity
              key={`h-slot-${row}-${col}`}
              style={[
                styles.wallSlot,
                styles.horizontalSlot,
                {
                  width: cellSize * 2 + wallGap,
                  height: wallGap,
                  left: col * (cellSize + wallGap),
                  top: (row + 1) * (cellSize + wallGap) - wallGap / 2,
                },
                placed && styles.wallSlotOccupied,
              ]}
              onPress={() => placingWall && !placed && onWallSlotPress('h', row, col)}
              disabled={!placingWall || placed}
            />
          );
        })
      )}

      {/* Vertical Wall Slots */}
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => {
          const placed = isWallPlaced('v', row, col);
          
          return (
            <TouchableOpacity
              key={`v-slot-${row}-${col}`}
              style={[
                styles.wallSlot,
                styles.verticalSlot,
                {
                  width: wallGap,
                  height: cellSize * 2 + wallGap,
                  left: (col + 1) * (cellSize + wallGap) - wallGap / 2,
                  top: row * (cellSize + wallGap),
                },
                placed && styles.wallSlotOccupied,
              ]}
              onPress={() => placingWall && !placed && onWallSlotPress('v', row, col)}
              disabled={!placingWall || placed}
            />
          );
        })
      )}

      {/* Walls */}
      {walls.map((wall, index) => (
        <Wall
          key={`wall-${index}`}
          type={wall.type}
          row={wall.row}
          col={wall.col}
        />
      ))}

      {/* Wall Preview */}
      {wallPreview && (
        <Wall
          type={wallPreview.type}
          row={wallPreview.row}
          col={wallPreview.col}
          isPreview
        />
      )}

      {/* Pawns */}
      <Pawn position={player1Pos} color={colors.player1} isCurrentPlayer={currentPlayer === 0} />
      <Pawn position={player2Pos} color={colors.player2} isCurrentPlayer={currentPlayer === 1} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.wood,
    borderRadius: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 3,
    borderColor: colors.woodDark,
  },
  cell: {
    position: 'absolute',
    backgroundColor: colors.boardBg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.wallSlot,
  },
  highlightedCell: {
    backgroundColor: colors.cellHighlight,
    borderColor: colors.gold,
    borderWidth: 2,
  },
  selectedCell: {
    backgroundColor: colors.cellHighlight,
    borderColor: colors.goldLight,
    borderWidth: 2,
  },
  wallSlot: {
    position: 'absolute',
    backgroundColor: colors.wallSlot,
    borderRadius: 2,
  },
  horizontalSlot: {
    // Horizontal wall slot styling
  },
  verticalSlot: {
    // Vertical wall slot styling
  },
  wallSlotOccupied: {
    backgroundColor: 'transparent',
  },
});
