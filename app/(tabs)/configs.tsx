import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useDice } from '@/hooks/useDice';
import { ConfigCard } from '@/components/dice/ConfigCard';
import { Button } from '@/components/ui/Button';
import { SPACING, TYPOGRAPHY } from '@/constants/theme';

export default function ConfigsScreen() {
  const { configs, deleteConfig, resetAllData, theme } = useDice();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Configuration',
      'Are you sure you want to delete this dice configuration?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteConfig(id),
        },
      ]
    );
  };

  const handleResetAll = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete ALL configurations and roll history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: resetAllData,
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primary }]}>CONFIGURATIONS</Text>
        <View style={styles.headerActions}>
          <Button
            title="CREATE NEW"
            onPress={() => router.push('/edit-config')}
            size="medium"
          />
          {configs.length > 0 ? (
            <Button
              title="RESET ALL"
              onPress={handleResetAll}
              variant="danger"
              size="medium"
            />
          ) : null}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {configs.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="settings" size={64} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No configurations yet
            </Text>
            <Text style={[styles.emptyHint, { color: theme.textSecondary }]}>
              Create your first custom dice
            </Text>
          </View>
        ) : (
          configs.map(config => (
            <ConfigCard
              key={config.id}
              config={config}
              onPress={() => router.push({ pathname: '/edit-config', params: { id: config.id } })}
              onEdit={() => router.push({ pathname: '/edit-config', params: { id: config.id } })}
              onDelete={() => handleDelete(config.id)}
            />
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
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
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
});
