import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { DiceConfig, RollResult } from '@/services/diceService';
import { saveConfigs, loadConfigs, saveHistory, loadHistory } from '@/services/storageService';
import { ThemeId, THEME_PRESETS } from '@/constants/theme';

interface DiceContextType {
  configs: DiceConfig[];
  history: RollResult[];
  currentTheme: ThemeId;
  theme: typeof THEME_PRESETS.crimson;
  loading: boolean;
  addConfig: (config: DiceConfig) => Promise<void>;
  updateConfig: (config: DiceConfig) => Promise<void>;
  deleteConfig: (id: string) => Promise<void>;
  addRollResult: (result: RollResult) => Promise<void>;
  clearHistory: () => Promise<void>;
  resetAllData: () => Promise<void>;
  setTheme: (themeId: ThemeId) => void;
}

export const DiceContext = createContext<DiceContextType | undefined>(undefined);

export function DiceProvider({ children }: { children: ReactNode }) {
  const [configs, setConfigs] = useState<DiceConfig[]>([]);
  const [history, setHistory] = useState<RollResult[]>([]);
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('crimson');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [loadedConfigs, loadedHistory] = await Promise.all([
        loadConfigs(),
        loadHistory(),
      ]);
      setConfigs(loadedConfigs);
      setHistory(loadedHistory);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addConfig = async (config: DiceConfig) => {
    const newConfigs = [...configs, config];
    setConfigs(newConfigs);
    await saveConfigs(newConfigs);
  };

  const updateConfig = async (config: DiceConfig) => {
    const newConfigs = configs.map(c => c.id === config.id ? config : c);
    setConfigs(newConfigs);
    await saveConfigs(newConfigs);
  };

  const deleteConfig = async (id: string) => {
    const newConfigs = configs.filter(c => c.id !== id);
    setConfigs(newConfigs);
    await saveConfigs(newConfigs);
  };

  const addRollResult = async (result: RollResult) => {
    const newHistory = [result, ...history].slice(0, 100);
    setHistory(newHistory);
    await saveHistory(newHistory);
  };

  const clearHistory = async () => {
    setHistory([]);
    await saveHistory([]);
  };

  const resetAllData = async () => {
    setConfigs([]);
    setHistory([]);
    await Promise.all([
      saveConfigs([]),
      saveHistory([]),
    ]);
  };

  const setTheme = (themeId: ThemeId) => {
    setCurrentTheme(themeId);
  };

  return (
    <DiceContext.Provider
      value={{
        configs,
        history,
        currentTheme,
        theme: THEME_PRESETS[currentTheme],
        loading,
        addConfig,
        updateConfig,
        deleteConfig,
        addRollResult,
        clearHistory,
        resetAllData,
        setTheme,
      }}
    >
      {children}
    </DiceContext.Provider>
  );
}
