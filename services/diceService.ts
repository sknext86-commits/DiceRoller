export type DiceSides = 6 | 8 | 10 | 12;

export interface DiceFace {
  type: 'text' | 'image';
  content: string;
}

export interface IndividualDice {
  id: string;
  sides: DiceSides;
  faces: DiceFace[];
  color: string;
}

export interface DiceConfig {
  id: string;
  name: string;
  dice: IndividualDice[];
  createdAt: number;
}

export interface RollResult {
  id: string;
  configId: string;
  configName: string;
  results: { diceId: string; value: number }[];
  timestamp: number;
}

export const DICE_SIDES_OPTIONS: DiceSides[] = [6, 8, 10, 12];

export const DICE_COLORS = [
  { id: 'crimson', name: 'Crimson', value: '#DC143C' },
  { id: 'gold', name: 'Gold', value: '#FFD700' },
  { id: 'pink', name: 'Hot Pink', value: '#FF1493' },
  { id: 'neon', name: 'Neon Green', value: '#39FF14' },
  { id: 'purple', name: 'Deep Purple', value: '#9400D3' },
  { id: 'cyan', name: 'Electric Cyan', value: '#00FFFF' },
  { id: 'orange', name: 'Flame Orange', value: '#FF4500' },
  { id: 'emerald', name: 'Emerald', value: '#50C878' },
] as const;

export const createEmptyIndividualDice = (sides: DiceSides, color: string): IndividualDice => {
  const faces: DiceFace[] = Array.from({ length: sides }, (_, i) => ({
    type: 'text',
    content: (i + 1).toString(),
  }));

  return {
    id: `dice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    sides,
    faces,
    color,
  };
};

export const createEmptyDiceConfig = (): DiceConfig => {
  return {
    id: Date.now().toString(),
    name: 'New Dice Set',
    dice: [createEmptyIndividualDice(6, DICE_COLORS[0].value)],
    createdAt: Date.now(),
  };
};

export const rollDice = (config: DiceConfig): { diceId: string; value: number }[] => {
  return config.dice.map(dice => ({
    diceId: dice.id,
    value: Math.floor(Math.random() * dice.sides),
  }));
};

export const createRollResult = (
  config: DiceConfig,
  results: { diceId: string; value: number }[],
): RollResult => {
  return {
    id: Date.now().toString(),
    configId: config.id,
    configName: config.name,
    results,
    timestamp: Date.now(),
  };
};

export const validateDiceConfig = (config: DiceConfig): string | null => {
  if (!config.name.trim()) {
    return 'Configuration name is required';
  }
  
  if (config.dice.length === 0) {
    return 'At least one dice is required';
  }

  if (config.dice.length > 5) {
    return 'Maximum 5 dice allowed per configuration';
  }

  for (let i = 0; i < config.dice.length; i++) {
    const dice = config.dice[i];
    if (dice.faces.length !== dice.sides) {
      return `Dice ${i + 1}: Must have exactly ${dice.sides} faces configured`;
    }

    for (let j = 0; j < dice.faces.length; j++) {
      const face = dice.faces[j];
      if (!face.content.trim()) {
        return `Dice ${i + 1}, Face ${j + 1}: Cannot be empty`;
      }
    }
  }

  return null;
};
