import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../constants/theme';
import Constants from 'expo-constants';

type GameResult = {
  game_number: number;
  winner_name: string;
  game_mode: string;
  created_at: string;
};

export default function HistoryScreen() {
  const router = useRouter();
  const [games, setGames] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameHistory();
  }, []);

  const fetchGameHistory = async () => {
    try {
      const backendUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/games`);
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error('Failed to fetch game history:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderGameItem = ({ item }: { item: GameResult }) => (
    <View style={styles.gameItem}>
      <View style={styles.gameNumber}>
        <Text style={styles.gameNumberText}>#{item.game_number}</Text>
      </View>
      
      <View style={styles.gameInfo}>
        <View style={styles.winnerRow}>
          <Ionicons name="trophy" size={20} color={colors.gold} />
          <Text style={styles.winnerName}>{item.winner_name}</Text>
        </View>
        
        <View style={styles.modeRow}>
          <Ionicons 
            name={item.game_mode === 'ai' ? 'hardware-chip' : 'people'} 
            size={16} 
            color={colors.cream} 
          />
          <Text style={styles.modeText}>
            {item.game_mode === 'ai' ? 'VS AI' : 'Local 2-Player'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.cream} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Ionicons name="trophy" size={32} color={colors.gold} />
          <Text style={styles.title}>Game History</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.gold} />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      ) : games.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="file-tray-outline" size={64} color={colors.wallSlot} />
          <Text style={styles.emptyText}>No games played yet</Text>
          <Text style={styles.emptySubtext}>Start playing to build your history!</Text>
        </View>
      ) : (
        <FlatList
          data={games}
          renderItem={renderGameItem}
          keyExtractor={(item) => item.game_number.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    gap: spacing.md,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.cream,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 16,
    color: colors.cream,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.cream,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.cream,
    opacity: 0.7,
    textAlign: 'center',
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  gameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.boardBg,
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.wallSlot,
  },
  gameNumber: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.gold,
  },
  gameNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gold,
  },
  gameInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  winnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  winnerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.cream,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  modeText: {
    fontSize: 14,
    color: colors.cream,
    opacity: 0.7,
  },
});
