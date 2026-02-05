import { create } from 'zustand';
import { getRandomDinoPair } from '../utils/dinoEmojis';

type Position = [number, number];

type Wall = {
  type: 'h' | 'v';
  row: number;
  col: number;
};

type Player = {
  name: string;
  position: Position;
  wallsLeft: number;
  emoji: string;
};

type GameMode = 'local' | 'ai';

type GameState = {
  mode: GameMode | null;
  players: Player[];
  currentPlayer: 0 | 1;
  walls: Wall[];
  gameOver: boolean;
  winner: string | null;
  selectedCell: Position | null;
  wallPreview: Wall | null;
  placingWall: boolean;
  wallOrientation: 'h' | 'v';
  
  // Actions
  setMode: (mode: GameMode) => void;
  initGame: (player1Name: string, player2Name: string) => void;
  movePawn: (position: Position) => void;
  placeWall: (wall: Wall) => void;
  setSelectedCell: (position: Position | null) => void;
  setWallPreview: (wall: Wall | null) => void;
  toggleWallPlacement: () => void;
  toggleWallOrientation: () => void;
  switchPlayer: () => void;
  setWinner: (winner: string) => void;
  resetGame: () => void;
};

export const useGameStore = create<GameState>((set, get) => ({
  mode: null,
  players: [
    { name: '', position: [8, 4], wallsLeft: 10, emoji: '🦕' },
    { name: '', position: [0, 4], wallsLeft: 10, emoji: '🦖' },
  ],
  currentPlayer: 0,
  walls: [],
  gameOver: false,
  winner: null,
  selectedCell: null,
  wallPreview: null,
  placingWall: false,
  wallOrientation: 'h',

  setMode: (mode) => set({ mode }),

  initGame: (player1Name, player2Name) => {
    const [emoji1, emoji2] = getRandomDinoPair();
    set({
      players: [
        { name: player1Name, position: [8, 4], wallsLeft: 10, emoji: emoji1 },
        { name: player2Name, position: [0, 4], wallsLeft: 10, emoji: emoji2 },
      ],
      currentPlayer: 0,
      walls: [],
      gameOver: false,
      winner: null,
      selectedCell: null,
      wallPreview: null,
      placingWall: false,
      wallOrientation: 'h',
    });
  },

  movePawn: (position) => {
    const state = get();
    const newPlayers = [...state.players];
    newPlayers[state.currentPlayer].position = position;
    
    // Check win condition
    const targetRow = state.currentPlayer === 0 ? 0 : 8;
    if (position[0] === targetRow) {
      set({
        players: newPlayers,
        gameOver: true,
        winner: newPlayers[state.currentPlayer].name,
        selectedCell: null,
      });
    } else {
      set({ players: newPlayers, selectedCell: null });
      get().switchPlayer();
      
      // If AI mode and it's AI's turn, trigger AI move
      if (state.mode === 'ai' && state.currentPlayer === 0) {
        setTimeout(() => {
          // AI will make move in game component
        }, 500);
      }
    }
  },

  placeWall: (wall) => {
    const state = get();
    const newPlayers = [...state.players];
    newPlayers[state.currentPlayer].wallsLeft -= 1;
    
    set({
      walls: [...state.walls, wall],
      players: newPlayers,
      wallPreview: null,
      placingWall: false,
    });
    
    get().switchPlayer();
    
    // If AI mode and it's AI's turn, trigger AI move
    if (state.mode === 'ai' && state.currentPlayer === 0) {
      setTimeout(() => {
        // AI will make move in game component
      }, 500);
    }
  },

  setSelectedCell: (position) => set({ selectedCell: position }),
  
  setWallPreview: (wall) => set({ wallPreview: wall }),
  
  toggleWallPlacement: () => set((state) => ({ 
    placingWall: !state.placingWall,
    selectedCell: null,
    wallPreview: null,
  })),
  
  toggleWallOrientation: () => set((state) => ({
    wallOrientation: state.wallOrientation === 'h' ? 'v' : 'h',
    wallPreview: null,
  })),
  
  switchPlayer: () => set((state) => ({
    currentPlayer: state.currentPlayer === 0 ? 1 : 0,
  })),
  
  setWinner: (winner) => set({ gameOver: true, winner }),
  
  resetGame: () => {
    const state = get();
    const [emoji1, emoji2] = getRandomDinoPair();
    set({
      players: [
        { name: state.players[0].name, position: [8, 4], wallsLeft: 10, emoji: emoji1 },
        { name: state.players[1].name, position: [0, 4], wallsLeft: 10, emoji: emoji2 },
      ],
      currentPlayer: 0,
      walls: [],
      gameOver: false,
      winner: null,
      selectedCell: null,
      wallPreview: null,
      placingWall: false,
      wallOrientation: 'h',
    });
  },
}));
