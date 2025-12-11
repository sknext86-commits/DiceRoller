import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useDice } from '@/hooks/useDice';
import { DiceViewer } from '@/components/dice/DiceViewer';
import { Button } from '@/components/ui/Button';
import { rollDice, createRollResult } from '@/services/diceService';
import { SPACING, TYPOGRAPHY, THEME_PRESETS, ThemeId } from '@/constants/theme';

export default function RollScreen() {
  const { configs, addRollResult, theme, currentTheme, setTheme } = useDice();
  const insets = useSafeAreaInsets();
  
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);
  const [results, setResults] = useState<{ diceId: string; value: number }[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const selectedConfig = configs.find(c => c.id === selectedConfigId);

  const handleRoll = async () => {
    if (!selectedConfig) {
      Alert.alert('No Configuration Selected', 'Please select a dice configuration first');
      return;
    }

    setIsRolling(true);
    
    setTimeout(async () => {
      const newResults = rollDice(selectedConfig);
      setResults(newResults);
      
      const rollResult = createRollResult(selectedConfig, newResults);
      await addRollResult(rollResult);
      
      setIsRolling(false);
    }, 1500);
  };

  const renderThemeSelector = () => (
    <View style={styles.themeSelector}>
      {Object.keys(THEME_PRESETS).map((themeKey) => {
        const themeId = themeKey as ThemeId;
        const themeData = THEME_PRESETS[themeId];
        return (
          <TouchableOpacity
            key={themeId}
            style={[
              styles.themeButton,
              {
                backgroundColor: themeData.primary,
                borderColor: currentTheme === themeId ? '#FFFFFF' : 'transparent',
              },
            ]}
            onPress={() => setTheme(themeId)}
          >
            {currentTheme === themeId ? (
              <MaterialIcons name="check" size={16} color="#000000" />
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.primary }]}>DICE ROLLER</Text>
          {renderThemeSelector()}
        </View>

        {configs.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="casino" size={64} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No dice configurations yet
            </Text>
            <Text style={[styles.emptyHint, { color: theme.textSecondary }]}>
              Create one in the Configs tab
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>SELECT CONFIGURATION</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {configs.map(config => (
                  <TouchableOpacity
                    key={config.id}
                    style={[
                      styles.configOption,
                      {
                        backgroundColor: theme.surface,
                        borderColor: selectedConfigId === config.id ? theme.primary : theme.surfaceVariant,
                      },
                    ]}
                    onPress={() => setSelectedConfigId(config.id)}
                  >
                    <Text style={[styles.configName, { color: theme.text }]} numberOfLines={1}>
                      {config.name}
                    </Text>
                    <Text style={[styles.configMeta, { color: theme.primary }]}>
                      {config.dice.length} {config.dice.length === 1 ? 'dice' : 'dice'}
                    </Text>
                    <View style={styles.colorDots}>
                      {config.dice.slice(0, 5).map((dice, i) => (
                        <View
                          key={dice.id}
                          style={[styles.colorDot, { backgroundColor: dice.color }]}
                        />
                      ))}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {results.length > 0 && selectedConfig ? (
              <View style={styles.resultsContainer}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>RESULTS</Text>
                <View style={styles.diceGrid}>
                  {results.map((result) => {
                    const dice = selectedConfig.dice.find(d => d.id === result.diceId);
                    if (!dice) return null;
                    return (
                      <DiceViewer
                        key={result.diceId}
                        dice={dice}
                        result={result.value}
                        isRolling={isRolling}
                      />
                    );
                  })}
                </View>
              </View>
            ) : null}

            <Button
              title={isRolling ? 'ROLLING...' : 'ROLL ALL DICE'}
              onPress={handleRoll}
              disabled={isRolling || !selectedConfig}
              size="large"
              style={styles.rollButton}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h1,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  themeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: SPACING.md,
  },
  configOption: {
    minWidth: 140,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: SPACING.md,
  },
  configName: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  configMeta: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  colorDots: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  resultsContainer: {
    marginBottom: SPACING.xl,
  },
  diceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  rollButton: {
    marginTop: SPACING.lg,
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
