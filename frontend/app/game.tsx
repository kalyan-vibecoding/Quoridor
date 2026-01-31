import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../constants/theme';
import { useGameStore } from '../store/gameStore';
import { GameBoard } from '../components/GameBoard';
import { GameControls } from '../components/GameControls';
import { WinModal } from '../components/WinModal';
import { getValidMoves, isValidMove } from '../utils/gameLogic';
import { isWallPlacementValid } from '../utils/pathfinding';
import { getAIMove } from '../utils/ai';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';

export default function GameScreen() {
  const router = useRouter();
  const {
    mode,
    players,
    currentPlayer,
    walls,
    gameOver,
    winner,
    selectedCell,
    wallPreview,
    placingWall,
    wallOrientation,
    movePawn,
    placeWall,
    setSelectedCell,
    setWallPreview,
    toggleWallPlacement,
    toggleWallOrientation,
    resetGame,
  } = useGameStore();

  const [validMoves, setValidMoves] = useState<[number, number][]>([]);

  // Update valid moves when player changes or walls change
  useEffect(() => {
    if (!gameOver) {
      const moves = getValidMoves(
        players[currentPlayer].position,
        players[currentPlayer === 0 ? 1 : 0].position,
        walls
      );
      setValidMoves(moves);
    }
  }, [currentPlayer, walls, gameOver, players]);

  // AI move logic
  useEffect(() => {
    if (mode === 'ai' && currentPlayer === 1 && !gameOver) {
      const timer = setTimeout(() => {
        const aiMove = getAIMove(
          players[1].position,
          players[0].position,
          walls,
          players[1].wallsLeft
        );

        if (aiMove.type === 'move' && aiMove.position) {
          movePawn(aiMove.position);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else if (aiMove.type === 'wall' && aiMove.wall) {
          placeWall(aiMove.wall);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameOver, mode]);

  const handleCellPress = (row: number, col: number) => {
    if (gameOver) return;

    const position: [number, number] = [row, col];

    // If clicking on current player's position, select it
    if (
      row === players[currentPlayer].position[0] &&
      col === players[currentPlayer].position[1]
    ) {
      setSelectedCell(position);
      return;
    }

    // If cell is a valid move, move to it
    if (isValidMove(position, validMoves)) {
      movePawn(position);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleWallSlotPress = (type: 'h' | 'v', row: number, col: number) => {
    if (gameOver || !placingWall) return;

    // Check if current player has walls left
    if (players[currentPlayer].wallsLeft === 0) {
      Alert.alert('No Walls Left', 'You have no more walls to place!');
      return;
    }

    const wall = { type: wallOrientation, row, col };

    // Validate wall placement
    if (
      isWallPlacementValid(
        wall,
        walls,
        players[0].position,
        players[1].position
      )
    ) {
      placeWall(wall);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else {
      Alert.alert(
        'Invalid Placement',
        'Wall placement would block a player\'s path to their goal!'
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleWallPreview = (type: 'h' | 'v', row: number, col: number) => {
    if (placingWall) {
      const wall = { type: wallOrientation, row, col };
      setWallPreview(wall);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Game',
      'Are you sure you want to start a new game?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetGame();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const handlePlayAgain = () => {
    resetGame();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleHome = async () => {
    // Save game result
    if (winner) {
      try {
        const backendUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL;
        await fetch(`${backendUrl}/api/games`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            winner_name: winner,
            game_mode: mode,
          }),
        });
      } catch (error) {
        console.error('Failed to save game result:', error);
      }
    }
    
    router.push('/');
  };

  const currentPlayerColor = currentPlayer === 0 ? colors.player1 : colors.player2;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.cream} />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.modeText}>
              {mode === 'ai' ? 'VS AI' : '2-Player'}
            </Text>
          </View>
          
          <View style={styles.placeholder} />
        </View>

        <GameControls
          currentPlayerName={players[currentPlayer].name}
          currentPlayerColor={currentPlayerColor}
          player1Name={players[0].name}
          player1WallsLeft={players[0].wallsLeft}
          player2Name={players[1].name}
          player2WallsLeft={players[1].wallsLeft}
          placingWall={placingWall}
          wallOrientation={wallOrientation}
          onToggleWallPlacement={toggleWallPlacement}
          onToggleWallOrientation={toggleWallOrientation}
          onReset={handleReset}
          currentPlayerIndex={currentPlayer}
        />

        <View style={styles.boardContainer}>
          <GameBoard
            player1Pos={players[0].position}
            player2Pos={players[1].position}
            walls={walls}
            wallPreview={wallPreview}
            selectedCell={selectedCell}
            validMoves={validMoves}
            placingWall={placingWall}
            currentPlayer={currentPlayer}
            onCellPress={handleCellPress}
            onWallSlotPress={handleWallSlotPress}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {placingWall
              ? 'Tap on wall slots to place a wall'
              : 'Tap your pawn, then tap where to move'}
          </Text>
        </View>
      </ScrollView>

      <WinModal
        visible={gameOver}
        winnerName={winner || ''}
        onPlayAgain={handlePlayAgain}
        onHome={handleHome}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: spacing.sm,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  modeText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gold,
  },
  placeholder: {
    width: 40,
  },
  boardContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  footer: {
    backgroundColor: colors.boardBg,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.cream,
    opacity: 0.8,
    textAlign: 'center',
  },
});
