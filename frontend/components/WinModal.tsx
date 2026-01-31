import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { colors, spacing } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type WinModalProps = {
  visible: boolean;
  winnerName: string;
  onPlayAgain: () => void;
  onHome: () => void;
};

export const WinModal: React.FC<WinModalProps> = ({
  visible,
  winnerName,
  onPlayAgain,
  onHome,
}) => {
  const { width, height } = Dimensions.get('window');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {visible && (
          <ConfettiCannon
            count={200}
            origin={{ x: width / 2, y: -10 }}
            fadeOut
            autoStart
          />
        )}
        
        <View style={styles.modal}>
          <Ionicons name="trophy" size={80} color={colors.gold} />
          
          <Text style={styles.title}>Victory!</Text>
          
          <View style={styles.winnerBox}>
            <Text style={styles.winnerLabel}>Winner</Text>
            <Text style={styles.winnerName}>{winnerName}</Text>
          </View>
          
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={onPlayAgain}>
              <Ionicons name="refresh" size={24} color={colors.cream} />
              <Text style={styles.buttonText}>Play Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onHome}>
              <Ionicons name="home" size={24} color={colors.gold} />
              <Text style={[styles.buttonText, styles.secondaryText]}>Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.modalBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: colors.boardBg,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
    width: '85%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.gold,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  winnerBox: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.lg,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  winnerLabel: {
    fontSize: 14,
    color: colors.cream,
    opacity: 0.7,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  winnerName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.goldLight,
  },
  buttons: {
    width: '100%',
    gap: spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gold,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    gap: spacing.sm,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.gold,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.background,
  },
  secondaryText: {
    color: colors.gold,
  },
});
