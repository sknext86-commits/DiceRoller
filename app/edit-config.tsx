import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useDice } from '@/hooks/useDice';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from '@/components/dice/ImageUploader';
import { 
  DiceConfig, 
  IndividualDice,
  DiceSides, 
  DICE_SIDES_OPTIONS, 
  DICE_COLORS,
  createEmptyDiceConfig, 
  createEmptyIndividualDice,
  validateDiceConfig 
} from '@/services/diceService';
import { SPACING, TYPOGRAPHY } from '@/constants/theme';

export default function EditConfigScreen() {
  const { configs, addConfig, updateConfig, theme } = useDice();
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const editingConfig = params.id ? configs.find(c => c.id === params.id) : null;

  const [config, setConfig] = useState<DiceConfig>(
    editingConfig || createEmptyDiceConfig()
  );
  const [selectedDiceIndex, setSelectedDiceIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');

  const selectedDice = config.dice[selectedDiceIndex];

  const handleSave = async () => {
    const error = validateDiceConfig(config);
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }

    try {
      if (editingConfig) {
        await updateConfig(config);
      } else {
        await addConfig(config);
      }
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save configuration');
    }
  };

  const handleAddDice = () => {
    if (config.dice.length >= 5) {
      Alert.alert('Limit Reached', 'Maximum 5 dice allowed per configuration');
      return;
    }

    const newDice = createEmptyIndividualDice(6, DICE_COLORS[config.dice.length % DICE_COLORS.length].value);
    setConfig({
      ...config,
      dice: [...config.dice, newDice],
    });
    setSelectedDiceIndex(config.dice.length);
  };

  const handleRemoveDice = (index: number) => {
    if (config.dice.length === 1) {
      Alert.alert('Cannot Remove', 'At least one dice is required');
      return;
    }

    Alert.alert(
      'Remove Dice',
      'Are you sure you want to remove this dice?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const newDice = config.dice.filter((_, i) => i !== index);
            setConfig({ ...config, dice: newDice });
            setSelectedDiceIndex(Math.max(0, index - 1));
          },
        },
      ]
    );
  };

  const handleDiceUpdate = (updatedDice: IndividualDice) => {
    const newDice = [...config.dice];
    newDice[selectedDiceIndex] = updatedDice;
    setConfig({ ...config, dice: newDice });
  };

  const handleSidesChange = (sides: DiceSides) => {
    const newFaces = Array.from({ length: sides }, (_, i) => {
      if (i < selectedDice.faces.length) {
        return selectedDice.faces[i];
      }
      return { type: 'text' as const, content: (i + 1).toString() };
    });

    handleDiceUpdate({
      ...selectedDice,
      sides,
      faces: newFaces,
    });
  };

  const handleColorChange = (color: string) => {
    handleDiceUpdate({ ...selectedDice, color });
  };

  const handleFaceUpdate = (index: number, content: string) => {
    const newFaces = [...selectedDice.faces];
    newFaces[index] = {
      type: activeTab,
      content,
    };
    handleDiceUpdate({ ...selectedDice, faces: newFaces });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: theme.primary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.primary }]}>
          {editingConfig ? 'EDIT CONFIG' : 'NEW CONFIG'}
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Input
          label="CONFIGURATION NAME"
          value={config.name}
          onChangeText={(name) => setConfig({ ...config, name })}
          placeholder="Enter configuration name"
        />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              DICE ({config.dice.length}/5)
            </Text>
            {config.dice.length < 5 ? (
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.primary }]}
                onPress={handleAddDice}
              >
                <MaterialIcons name="add" size={20} color="#000000" />
                <Text style={styles.addButtonText}>ADD DICE</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.diceSelector}>
            {config.dice.map((dice, index) => (
              <TouchableOpacity
                key={dice.id}
                style={[
                  styles.diceTab,
                  {
                    backgroundColor: selectedDiceIndex === index ? theme.surface : theme.surfaceVariant,
                    borderColor: dice.color,
                  },
                ]}
                onPress={() => setSelectedDiceIndex(index)}
              >
                <View style={styles.diceTabHeader}>
                  <Text style={[styles.diceTabTitle, { color: theme.text }]}>
                    Dice {index + 1}
                  </Text>
                  {config.dice.length > 1 ? (
                    <TouchableOpacity
                      onPress={() => handleRemoveDice(index)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <MaterialIcons name="close" size={16} color={theme.textSecondary} />
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View style={[styles.colorIndicator, { backgroundColor: dice.color }]} />
                <Text style={[styles.diceTabSides, { color: theme.textSecondary }]}>
                  {dice.sides} sides
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {selectedDice ? (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>DICE COLOR</Text>
              <View style={styles.colorSelector}>
                {DICE_COLORS.map(colorOption => (
                  <TouchableOpacity
                    key={colorOption.id}
                    style={[
                      styles.colorButton,
                      {
                        backgroundColor: colorOption.value,
                        borderColor: selectedDice.color === colorOption.value ? '#FFFFFF' : 'transparent',
                      },
                    ]}
                    onPress={() => handleColorChange(colorOption.value)}
                  >
                    {selectedDice.color === colorOption.value ? (
                      <MaterialIcons name="check" size={16} color="#000000" />
                    ) : null}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>NUMBER OF SIDES</Text>
              <View style={styles.sidesSelector}>
                {DICE_SIDES_OPTIONS.map(sides => (
                  <TouchableOpacity
                    key={sides}
                    style={[
                      styles.sideButton,
                      {
                        backgroundColor: selectedDice.sides === sides ? selectedDice.color : theme.surface,
                        borderColor: selectedDice.color,
                      },
                    ]}
                    onPress={() => handleSidesChange(sides)}
                  >
                    <Text
                      style={[
                        styles.sideText,
                        { color: selectedDice.sides === sides ? '#000000' : theme.text },
                      ]}
                    >
                      {sides}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>CONTENT TYPE</Text>
              <View style={styles.tabSelector}>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    {
                      backgroundColor: activeTab === 'text' ? selectedDice.color : theme.surface,
                      borderColor: selectedDice.color,
                    },
                  ]}
                  onPress={() => setActiveTab('text')}
                >
                  <MaterialIcons
                    name="text-fields"
                    size={24}
                    color={activeTab === 'text' ? '#000000' : theme.text}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      { color: activeTab === 'text' ? '#000000' : theme.text },
                    ]}
                  >
                    TEXT
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    {
                      backgroundColor: activeTab === 'image' ? selectedDice.color : theme.surface,
                      borderColor: selectedDice.color,
                    },
                  ]}
                  onPress={() => setActiveTab('image')}
                >
                  <MaterialIcons
                    name="image"
                    size={24}
                    color={activeTab === 'image' ? '#000000' : theme.text}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      { color: activeTab === 'image' ? '#000000' : theme.text },
                    ]}
                  >
                    IMAGE
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                CUSTOMIZE FACES ({selectedDice.sides} total)
              </Text>
              {selectedDice.faces.map((face, index) => (
                <View key={index} style={styles.faceEditor}>
                  <Text style={[styles.faceLabel, { color: theme.textSecondary }]}>
                    Face {index + 1}
                  </Text>
                  {activeTab === 'text' ? (
                    <Input
                      value={face.type === 'text' ? face.content : (index + 1).toString()}
                      onChangeText={(content) => handleFaceUpdate(index, content)}
                      placeholder={`Face ${index + 1}`}
                    />
                  ) : (
                    <ImageUploader
                      currentImage={face.type === 'image' ? face.content : undefined}
                      onImageSelected={(uri) => handleFaceUpdate(index, uri)}
                    />
                  )}
                </View>
              ))}
            </View>
          </>
        ) : null}

        <View style={styles.actions}>
          <Button
            title="CANCEL"
            onPress={() => router.back()}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="SAVE"
            onPress={handleSave}
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
  content: {
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  addButtonText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: '#000000',
  },
  diceSelector: {
    marginBottom: SPACING.md,
  },
  diceTab: {
    minWidth: 100,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: SPACING.md,
  },
  diceTabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  diceTabTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
  },
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: SPACING.xs,
  },
  diceTabSides: {
    ...TYPOGRAPHY.caption,
  },
  colorSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidesSelector: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  sideButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideText: {
    ...TYPOGRAPHY.h2,
    fontWeight: '800',
  },
  tabSelector: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
  },
  tabText: {
    ...TYPOGRAPHY.button,
  },
  faceEditor: {
    marginBottom: SPACING.lg,
  },
  faceLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  actionButton: {
    flex: 1,
  },
});
