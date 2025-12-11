import { useContext } from 'react';
import { DiceContext } from '@/contexts/DiceContext';

export function useDice() {
  const context = useContext(DiceContext);
  if (!context) {
    throw new Error('useDice must be used within DiceProvider');
  }
  return context;
}
