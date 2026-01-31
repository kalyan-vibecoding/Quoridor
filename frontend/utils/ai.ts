import { getValidMoves } from './gameLogic';
import { isWallPlacementValid } from './pathfinding';

type Position = [number, number];
type Wall = { type: 'h' | 'v'; row: number; col: number };

// Simple AI that tries to move toward goal and place strategic walls
export const getAIMove = (
  aiPos: Position,
  playerPos: Position,
  walls: Wall[],
  aiWallsLeft: number
): { type: 'move' | 'wall'; position?: Position; wall?: Wall } => {
  const validMoves = getValidMoves(aiPos, playerPos, walls);
  
  // 70% chance to move, 30% chance to place wall (if has walls left)
  const shouldPlaceWall = aiWallsLeft > 0 && Math.random() < 0.3;
  
  if (shouldPlaceWall) {
    const wall = findStrategicWall(aiPos, playerPos, walls);
    if (wall) {
      return { type: 'wall', wall };
    }
  }
  
  // Move toward goal (row 8 for AI)
  if (validMoves.length > 0) {
    // Find move that gets closest to goal row 8
    const bestMove = validMoves.reduce((best, move) => {
      const bestDist = Math.abs(8 - best[0]);
      const moveDist = Math.abs(8 - move[0]);
      return moveDist < bestDist ? move : best;
    });
    
    return { type: 'move', position: bestMove };
  }
  
  // Fallback: try to place a wall
  const wall = findStrategicWall(aiPos, playerPos, walls);
  if (wall && aiWallsLeft > 0) {
    return { type: 'wall', wall };
  }
  
  // No valid moves (shouldn't happen)
  return { type: 'move', position: aiPos };
};

// Find a strategic wall placement to block player
const findStrategicWall = (
  aiPos: Position,
  playerPos: Position,
  existingWalls: Wall[]
): Wall | null => {
  // Try to place wall in front of player's path
  const [playerRow, playerCol] = playerPos;
  
  // Player is moving up (toward row 0), so place horizontal walls above them
  const potentialWalls: Wall[] = [
    { type: 'h', row: Math.max(0, playerRow - 1), col: playerCol },
    { type: 'h', row: Math.max(0, playerRow - 1), col: Math.max(0, playerCol - 1) },
    { type: 'v', row: playerRow, col: Math.max(0, playerCol - 1) },
    { type: 'v', row: playerRow, col: Math.min(7, playerCol) },
    { type: 'h', row: Math.min(7, playerRow), col: playerCol },
    { type: 'v', row: Math.max(0, playerRow - 1), col: playerCol },
  ];
  
  // Shuffle for variety
  const shuffled = potentialWalls.sort(() => Math.random() - 0.5);
  
  for (const wall of shuffled) {
    if (isWallPlacementValid(wall, existingWalls, aiPos, playerPos)) {
      return wall;
    }
  }
  
  // Try random valid wall positions
  for (let i = 0; i < 20; i++) {
    const wall: Wall = {
      type: Math.random() < 0.5 ? 'h' : 'v',
      row: Math.floor(Math.random() * 8),
      col: Math.floor(Math.random() * 8),
    };
    
    if (isWallPlacementValid(wall, existingWalls, aiPos, playerPos)) {
      return wall;
    }
  }
  
  return null;
};
