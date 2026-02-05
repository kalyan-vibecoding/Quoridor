import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type GameControlsProps = {
  currentPlayerName: string;
  currentPlayerColor: string;
  player1Name: string;
  player1WallsLeft: number;
  player1Emoji: string;
  player2Name: string;
  player2WallsLeft: number;
  player2Emoji: string;
  placingWall: boolean;
  wallOrientation: 'h' | 'v';
  onToggleWallPlacement: () => void;
  onToggleWallOrientation: () => void;
  onReset: () => void;
  currentPlayerIndex: number;
};

export const GameControls: React.FC<GameControlsProps> = ({
  currentPlayerName,
  currentPlayerColor,
  player1Name,
  player1WallsLeft,
  player1Emoji,
  player2Name,
  player2WallsLeft,
  player2Emoji,
  placingWall,
  wallOrientation,
  onToggleWallPlacement,
  onToggleWallOrientation,
  onReset,
  currentPlayerIndex,
}) => {
  // Render wall icons for visual count
  const renderWalls = (count: number, playerColor: string) => {
    return (
      <View style={styles.wallsContainer}>
        {Array.from({ length: 10 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.wallIcon,
              {
                backgroundColor: index < count ? playerColor : colors.wallSlot,
                opacity: index < count ? 1 : 0.3,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Current Turn */}
      <View style={styles.turnIndicator}>
        <View style={[styles.playerDot, { backgroundColor: currentPlayerColor }]} />
        <Text style={styles.turnText}>{currentPlayerName}'s Turn</Text>
      </View>

      {/* Player Stats with Visual Walls */}
      <View style={styles.statsContainer}>
        {/* Player 1 - Bottom */}
        <View style={[styles.playerSection, currentPlayerIndex === 0 && styles.activePlayerSection]}>
          <View style={styles.playerHeader}>
            <View style={styles.playerInfo}>
              <Text style={styles.playerEmoji}>{player1Emoji}</Text>
              <Text style={styles.playerName}>{player1Name}</Text>
            </View>
            <Text style={styles.wallCountText}>{player1WallsLeft}</Text>
          </View>
          {renderWalls(player1WallsLeft, colors.player1)}
        </View>

        {/* Player 2 - Top */}
        <View style={[styles.playerSection, currentPlayerIndex === 1 && styles.activePlayerSection]}>
          <View style={styles.playerHeader}>
            <View style={styles.playerInfo}>
              <Text style={styles.playerEmoji}>{player2Emoji}</Text>
              <Text style={styles.playerName}>{player2Name}</Text>
            </View>
            <Text style={styles.wallCountText}>{player2WallsLeft}</Text>
          </View>
          {renderWalls(player2WallsLeft, colors.player2)}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, placingWall && styles.activeButton]}
          onPress={onToggleWallPlacement}
        >
          <Ionicons 
            name="remove" 
            size={24} 
            color={placingWall ? colors.background : colors.cream} 
          />
          <Text style={[styles.actionText, placingWall && styles.activeText]}>
            {placingWall ? 'Cancel Wall' : 'Place Wall'}
          </Text>
        </TouchableOpacity>

        {placingWall && (
          <TouchableOpacity
            style={styles.orientationButton}
            onPress={onToggleWallOrientation}
          >
            <Ionicons 
              name={wallOrientation === 'h' ? 'remove' : 'remove-outline'} 
              size={24} 
              color={colors.cream}
              style={wallOrientation === 'v' ? { transform: [{ rotate: '90deg' }] } : {}}
            />
            <Text style={styles.actionText}>
              {wallOrientation === 'h' ? 'Horizontal' : 'Vertical'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Ionicons name="refresh" size={20} color={colors.cream} />
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.boardBg,
    padding: spacing.md,
    borderRadius: 16,
    gap: spacing.md,
  },
  turnIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  playerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.cream,
  },
  turnText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.cream,
  },
  statsContainer: {
    gap: spacing.md,
  },
  playerSection: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activePlayerSection: {
    borderColor: colors.gold,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  playerEmoji: {
    fontSize: 24,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.cream,
  },
  wallCountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gold,
  },
  wallsContainer: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  wallIcon: {
    width: 28,
    height: 12,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.wallSlot,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gold,
    minWidth: 120,
  },
  activeButton: {
    backgroundColor: colors.gold,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.cream,
  },
  activeText: {
    color: colors.background,
  },
  orientationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.woodDark,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    minWidth: 120,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.wallSlot,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.cream,
  },
});
