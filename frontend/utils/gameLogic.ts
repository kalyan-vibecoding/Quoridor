import { isMovementBlocked } from './pathfinding';

type Position = [number, number];
type Wall = { type: 'h' | 'v'; row: number; col: number };

// Get valid moves for current player
export const getValidMoves = (
  playerPos: Position,
  otherPlayerPos: Position,
  walls: Wall[]
): Position[] => {
  const [row, col] = playerPos;
  const validMoves: Position[] = [];

  // Try all four adjacent directions
  const directions: Position[] = [
    [row - 1, col], // up
    [row + 1, col], // down
    [row, col - 1], // left
    [row, col + 1], // right
  ];

  for (const [newRow, newCol] of directions) {
    // Check bounds
    if (newRow < 0 || newRow > 8 || newCol < 0 || newCol > 8) {
      continue;
    }

    // Check if blocked by wall
    if (isMovementBlocked([row, col], [newRow, newCol], walls)) {
      continue;
    }

    // Check if occupied by other player (no jumping in this version)
    if (newRow === otherPlayerPos[0] && newCol === otherPlayerPos[1]) {
      continue;
    }

    validMoves.push([newRow, newCol]);
  }

  return validMoves;
};

// Check if position is valid move
export const isValidMove = (
  position: Position,
  validMoves: Position[]
): boolean => {
  return validMoves.some(
    ([row, col]) => row === position[0] && col === position[1]
  );
};
