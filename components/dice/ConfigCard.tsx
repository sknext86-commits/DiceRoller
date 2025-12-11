import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DiceConfig } from '@/services/diceService';
import { SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import { useDice } from '@/hooks/useDice';

interface ConfigCardProps {
  config: DiceConfig;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ConfigCard({ config, onPress, onEdit, onDelete }: ConfigCardProps) {
  const { theme } = useDice();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.primary },
        SHADOWS.md,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {config.name}
          </Text>
          <Text style={[styles.meta, { color: theme.textSecondary }]}>
            {config.dice.length} {config.dice.length === 1 ? 'dice' : 'dice'} • {new Date(config.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.surfaceVariant }]}
            onPress={onEdit}
          >
            <MaterialIcons name="edit" size={20} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.surfaceVariant }]}
            onPress={onDelete}
          >
            <MaterialIcons name="delete" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.preview}>
        {config.dice.map((dice, index) => (
          <View
            key={dice.id}
            style={[
              styles.dicePreview,
              { 
                backgroundColor: theme.surfaceVariant,
                borderColor: dice.color,
              },
            ]}
          >
            <View style={[styles.diceColorDot, { backgroundColor: dice.color }]} />
            <Text
              style={[styles.diceSides, { color: theme.text }]}
              numberOfLines={1}
            >
              {dice.sides}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  info: {
    flex: 1,
    marginRight: SPACING.md,
  },
  name: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.xs,
  },
  meta: {
    ...TYPOGRAPHY.caption,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  dicePreview: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  diceColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  diceSides: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
});
