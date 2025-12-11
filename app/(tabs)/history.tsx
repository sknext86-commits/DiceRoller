import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useDice } from '@/hooks/useDice';
import { Button } from '@/components/ui/Button';
import { SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme';

function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  const timeStr = date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  if (isToday) {
    return `Today at ${timeStr}`;
  }
  
  const dateStr = date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
  
  return `${dateStr} at ${timeStr}`;
}

export default function HistoryScreen() {
  const { history, clearHistory, theme, configs } = useDice();
  const insets = useSafeAreaInsets();

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all roll history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearHistory,
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primary }]}>ROLL HISTORY</Text>
        {history.length > 0 ? (
          <Button
            title="CLEAR ALL"
            onPress={handleClearHistory}
            variant="danger"
            size="medium"
          />
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="history" size={64} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No roll history yet
            </Text>
            <Text style={[styles.emptyHint, { color: theme.textSecondary }]}>
              Start rolling dice to see results here
            </Text>
          </View>
        ) : (
          history.map(result => (
            <View
              key={result.id}
              style={[
                styles.historyCard,
                { backgroundColor: theme.surface, borderColor: theme.primary },
                SHADOWS.md,
              ]}
            >
              <View style={styles.historyHeader}>
                <View style={styles.historyInfo}>
                  <Text style={[styles.configName, { color: theme.text }]}>
                    {result.configName}
                  </Text>
                  <Text style={[styles.timestamp, { color: theme.textSecondary }]}>
                    {formatDateTime(result.timestamp)}
                  </Text>
                </View>
                <View style={[styles.countBadge, { backgroundColor: theme.primary }]}>
                  <Text style={styles.countText}>{result.results.length}×</Text>
                </View>
              </View>

              <View style={styles.resultsRow}>
                {result.results.map((res, index) => {
                  const config = configs.find(c => c.id === result.configId);
                  const dice = config?.dice.find(d => d.id === res.diceId);
                  const diceColor = dice?.color || theme.primary;
                  const face = dice?.faces[res.value];
                  
                  if (!face) return null;
                  
                  return (
                    <View
                      key={index}
                      style={[
                        styles.resultBadge,
                        {
                          backgroundColor: theme.surfaceVariant,
                          borderColor: diceColor,
                        },
                      ]}
                    >
                      {face.type === 'text' ? (
                        <Text 
                          style={[styles.resultValue, { color: diceColor }]}
                          numberOfLines={2}
                          adjustsFontSizeToFit
                        >
                          {face.content}
                        </Text>
                      ) : (
                        <Image
                          source={{ uri: face.content }}
                          style={styles.resultImage}
                          contentFit="contain"
                        />
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    ...TYPOGRAPHY.h1,
    marginBottom: SPACING.md,
  },
  content: {
    padding: SPACING.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyText: {
    ...TYPOGRAPHY.h3,
    marginTop: SPACING.lg,
  },
  emptyHint: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.sm,
  },
  historyCard: {
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  historyInfo: {
    flex: 1,
  },
  configName: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.xs,
  },
  timestamp: {
    ...TYPOGRAPHY.caption,
  },
  countBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  countText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '800',
    color: '#000000',
  },
  resultsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  resultBadge: {
    width: 64,
    height: 64,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xs,
  },
  resultValue: {
    ...TYPOGRAPHY.body,
    fontWeight: '800',
    textAlign: 'center',
  },
  resultImage: {
    width: 56,
    height: 56,
    borderRadius: 4,
  },
});
