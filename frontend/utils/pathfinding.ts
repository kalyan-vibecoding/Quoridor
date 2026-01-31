import { Wall } from '../store/gameStore';

type Position = [number, number];

// BFS to check if player can reach their goal row
export const canReachGoal = (
  playerPos: Position,
  goalRow: number,
  walls: Wall[],
  otherPlayerPos: Position
): boolean => {
  const queue: Position[] = [playerPos];
  const visited = new Set<string>();
  visited.add(`${playerPos[0]},${playerPos[1]}`);

  while (queue.length > 0) {
    const [row, col] = queue.shift()!;
    
    // Check if reached goal row
    if (row === goalRow) {
      return true;
    }

    // Try all four directions
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

      const key = `${newRow},${newCol}`;
      if (visited.has(key)) {
        continue;
      }

      // Check if movement is blocked by wall
      if (isMovementBlocked([row, col], [newRow, newCol], walls)) {
        continue;
      }

      visited.add(key);
      queue.push([newRow, newCol]);
    }
  }

  return false;
};

// Check if movement from one cell to another is blocked by a wall
export const isMovementBlocked = (
  from: Position,
  to: Position,
  walls: Wall[]
): boolean => {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;

  for (const wall of walls) {
    if (wall.type === 'h') {
      // Horizontal wall blocks vertical movement
      if (fromCol === toCol) {
        // Moving up
        if (toRow < fromRow && wall.row === toRow) {
          if (wall.col === fromCol || wall.col === fromCol - 1) {
            return true;
          }
        }
        // Moving down
        if (toRow > fromRow && wall.row === fromRow) {
          if (wall.col === fromCol || wall.col === fromCol - 1) {
            return true;
          }
        }
      }
    } else {
      // Vertical wall blocks horizontal movement
      if (fromRow === toRow) {
        // Moving left
        if (toCol < fromCol && wall.col === toCol) {
          if (wall.row === fromRow || wall.row === fromRow - 1) {
            return true;
          }
        }
        // Moving right
        if (toCol > fromCol && wall.col === fromCol) {
          if (wall.row === fromRow || wall.row === fromRow - 1) {
            return true;
          }
        }
      }
    }
  }

  return false;
};

// Check if wall placement is valid
export const isWallPlacementValid = (
  wall: Wall,
  existingWalls: Wall[],
  player1Pos: Position,
  player2Pos: Position
): boolean => {
  // Check bounds
  if (wall.row < 0 || wall.row > 7 || wall.col < 0 || wall.col > 7) {
    return false;
  }

  // Check if wall already exists at this position
  for (const existingWall of existingWalls) {
    if (
      existingWall.type === wall.type &&
      existingWall.row === wall.row &&
      existingWall.col === wall.col
    ) {
      return false;
    }
  }

  // Check for overlapping perpendicular walls at intersection
  for (const existingWall of existingWalls) {
    if (existingWall.type !== wall.type) {
      // Check if walls cross at same intersection
      if (
        existingWall.row === wall.row &&
        existingWall.col === wall.col
      ) {
        return false;
      }
    }
  }

  // Check if wall blocks parallel walls (walls of same type shouldn't overlap)
  for (const existingWall of existingWalls) {
    if (existingWall.type === wall.type) {
      if (wall.type === 'h') {
        // Check horizontal walls
        if (existingWall.row === wall.row) {
          if (
            Math.abs(existingWall.col - wall.col) <= 1
          ) {
            return false;
          }
        }
      } else {
        // Check vertical walls
        if (existingWall.col === wall.col) {
          if (
            Math.abs(existingWall.row - wall.row) <= 1
          ) {
            return false;
          }
        }
      }
    }
  }

  // Check if this wall would completely block either player's path
  const testWalls = [...existingWalls, wall];
  
  const player1CanReach = canReachGoal(player1Pos, 0, testWalls, player2Pos);
  const player2CanReach = canReachGoal(player2Pos, 8, testWalls, player1Pos);

  return player1CanReach && player2CanReach;
};
