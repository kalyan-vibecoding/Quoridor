import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type GameControlsProps = {
  currentPlayerName: string;
  currentPlayerColor: string;
  player1Name: string;
  player1WallsLeft: number;
  player2Name: string;
  player2WallsLeft: number;
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
  player2Name,
  player2WallsLeft,
  placingWall,
  wallOrientation,
  onToggleWallPlacement,
  onToggleWallOrientation,
  onReset,
  currentPlayerIndex,
}) => {
  return (
    <View style={styles.container}>
      {/* Current Turn */}
      <View style={styles.turnIndicator}>
        <View style={[styles.playerDot, { backgroundColor: currentPlayerColor }]} />
        <Text style={styles.turnText}>{currentPlayerName}'s Turn</Text>
      </View>

      {/* Player Stats */}
      <View style={styles.stats}>
        <View style={[styles.playerStat, currentPlayerIndex === 0 && styles.activePlayer]}>
          <View style={[styles.playerDot, { backgroundColor: colors.player1 }]} />
          <Text style={styles.playerName}>{player1Name}</Text>
          <View style={styles.wallCount}>
            <Ionicons name="remove" size={16} color={colors.gold} />
            <Text style={styles.wallCountText}>{player1WallsLeft}</Text>
          </View>
        </View>

        <View style={[styles.playerStat, currentPlayerIndex === 1 && styles.activePlayer]}>
          <View style={[styles.playerDot, { backgroundColor: colors.player2 }]} />
          <Text style={styles.playerName}>{player2Name}</Text>
          <View style={styles.wallCount}>
            <Ionicons name="remove" size={16} color={colors.gold} />
            <Text style={styles.wallCountText}>{player2WallsLeft}</Text>
          </View>
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
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  playerStat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activePlayer: {
    borderColor: colors.gold,
  },
  playerName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.cream,
  },
  wallCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  wallCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gold,
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
