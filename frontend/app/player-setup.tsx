import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../constants/theme';
import { useGameStore } from '../store/gameStore';

export default function PlayerSetupScreen() {
  const router = useRouter();
  const mode = useGameStore(state => state.mode);
  const initGame = useGameStore(state => state.initGame);
  
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  const handleStartGame = () => {
    const p1 = player1Name.trim() || 'P1';
    const p2 = player2Name.trim() || (mode === 'ai' ? 'AI' : 'P2');
    
    initGame(p1, p2);
    router.push('/game');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.cream} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Ionicons name="person-add" size={48} color={colors.gold} />
            <Text style={styles.title}>Player Setup</Text>
            <Text style={styles.subtitle}>
              {mode === 'ai' ? 'Enter your initials' : 'Enter player initials'}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <View style={styles.playerIndicator}>
                <View style={[styles.playerDot, { backgroundColor: colors.player1 }]} />
                <Text style={styles.inputLabel}>Player 1</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter initials (e.g., JD)"
                placeholderTextColor={colors.wallSlot}
                value={player1Name}
                onChangeText={setPlayer1Name}
                maxLength={3}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>

            {mode === 'local' && (
              <View style={styles.inputContainer}>
                <View style={styles.playerIndicator}>
                  <View style={[styles.playerDot, { backgroundColor: colors.player2 }]} />
                  <Text style={styles.inputLabel}>Player 2</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter initials (e.g., SM)"
                  placeholderTextColor={colors.wallSlot}
                  value={player2Name}
                  onChangeText={setPlayer2Name}
                  maxLength={3}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>
            )}

            {mode === 'ai' && (
              <View style={styles.aiInfo}>
                <Ionicons name="hardware-chip" size={32} color={colors.gold} />
                <Text style={styles.aiText}>You will play against the AI opponent</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartGame}
          >
            <Text style={styles.startButtonText}>Start Game</Text>
            <Ionicons name="arrow-forward" size={24} color={colors.background} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    color: colors.cream,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.gold,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: 14,
    color: colors.cream,
    opacity: 0.7,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  inputContainer: {
    gap: spacing.sm,
  },
  playerIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  playerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.cream,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.cream,
  },
  input: {
    backgroundColor: colors.boardBg,
    borderWidth: 2,
    borderColor: colors.wallSlot,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 18,
    color: colors.cream,
    fontWeight: '600',
  },
  aiInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.boardBg,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  aiText: {
    flex: 1,
    fontSize: 14,
    color: colors.cream,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.gold,
    padding: spacing.lg,
    borderRadius: 12,
    marginTop: spacing.lg,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.background,
  },
});
