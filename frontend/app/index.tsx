import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../constants/theme';
import { useGameStore } from '../store/gameStore';

export default function HomeScreen() {
  const router = useRouter();
  const setMode = useGameStore(state => state.setMode);

  const handleModeSelect = (mode: 'local' | 'ai') => {
    setMode(mode);
    router.push('/player-setup');
  };

  const handleViewHistory = () => {
    router.push('/history');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="grid" size={64} color={colors.gold} />
          <Text style={styles.title}>QUORIDOR</Text>
          <Text style={styles.subtitle}>Strategic Board Game</Text>
        </View>

        <View style={styles.modeSection}>
          <Text style={styles.sectionTitle}>Select Game Mode</Text>
          
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => handleModeSelect('local')}
          >
            <Ionicons name="people" size={32} color={colors.cream} />
            <View style={styles.modeContent}>
              <Text style={styles.modeTitle}>Local 2-Player</Text>
              <Text style={styles.modeDescription}>
                Play with a friend on the same device
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.gold} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => handleModeSelect('ai')}
          >
            <Ionicons name="hardware-chip" size={32} color={colors.cream} />
            <View style={styles.modeContent}>
              <Text style={styles.modeTitle}>VS AI</Text>
              <Text style={styles.modeDescription}>
                Challenge the computer opponent
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.gold} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeButton, styles.historyButton]}
            onPress={handleViewHistory}
          >
            <Ionicons name="trophy" size={28} color={colors.gold} />
            <View style={styles.modeContent}>
              <Text style={styles.modeTitle}>Game History</Text>
              <Text style={styles.modeDescription}>
                View past game results
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.gold} />
          </TouchableOpacity>
        </View>

        <View style={styles.rules}>
          <Text style={styles.rulesTitle}>How to Play</Text>
          <Text style={styles.rulesText}>
            • Reach the opposite side of the board to win{' \n'}
            • Each turn: Move your pawn or place a wall{' \n'}
            • Walls block movement but can't trap players{' \n'}
            • Each player has 10 walls
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.gold,
    marginTop: spacing.md,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.cream,
    opacity: 0.7,
    marginTop: spacing.xs,
    letterSpacing: 2,
  },
  modeSection: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.cream,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.boardBg,
    padding: spacing.lg,
    borderRadius: 16,
    gap: spacing.md,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  historyButton: {
    borderColor: colors.wallSlot,
    borderWidth: 1,
  },
  modeContent: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.cream,
    marginBottom: spacing.xs,
  },
  modeDescription: {
    fontSize: 14,
    color: colors.cream,
    opacity: 0.7,
  },
  rules: {
    backgroundColor: colors.boardBg,
    padding: spacing.lg,
    borderRadius: 16,
    marginTop: spacing.lg,
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gold,
    marginBottom: spacing.sm,
  },
  rulesText: {
    fontSize: 14,
    color: colors.cream,
    lineHeight: 22,
  },
});
