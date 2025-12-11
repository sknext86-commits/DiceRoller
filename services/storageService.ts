import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiceConfig, RollResult } from './diceService';

const CONFIGS_KEY = 'dice_configs';
const HISTORY_KEY = 'dice_history';

export const saveConfigs = async (configs: DiceConfig[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CONFIGS_KEY, JSON.stringify(configs));
  } catch (error) {
    console.error('Failed to save configs:', error);
    throw new Error('Failed to save dice configurations');
  }
};

export const loadConfigs = async (): Promise<DiceConfig[]> => {
  try {
    const data = await AsyncStorage.getItem(CONFIGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load configs:', error);
    return [];
  }
};

export const saveHistory = async (history: RollResult[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save history:', error);
    throw new Error('Failed to save roll history');
  }
};

export const loadHistory = async (): Promise<RollResult[]> => {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([CONFIGS_KEY, HISTORY_KEY]);
  } catch (error) {
    console.error('Failed to clear data:', error);
    throw new Error('Failed to clear data');
  }
};
