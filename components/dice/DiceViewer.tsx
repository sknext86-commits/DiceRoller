import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Image } from 'expo-image';
import { IndividualDice, DiceFace } from '@/services/diceService';
import { SPACING, SHADOWS } from '@/constants/theme';
import { useDice } from '@/hooks/useDice';

interface DiceViewerProps {
  dice: IndividualDice;
  result: number;
  isRolling: boolean;
}

export function DiceViewer({ dice, result, isRolling }: DiceViewerProps) {
  const { theme } = useDice();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRolling) {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 300,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(scaleAnim, {
                toValue: 1.2,
                duration: 150,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ])
      ).start();
    } else {
      rotateAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }
  }, [isRolling]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const face = dice.faces[result];

  return (
    <Animated.View
      style={[
        styles.dice,
        {
          backgroundColor: theme.surface,
          borderColor: dice.color,
          transform: [
            { rotate: spin },
            { scale: scaleAnim },
            { perspective: 1000 },
          ],
        },
        SHADOWS.glow(dice.color),
      ]}
    >
      {face.type === 'text' ? (
        <Text
          style={[
            styles.faceText,
            { color: dice.color },
          ]}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {face.content}
        </Text>
      ) : (
        <Image
          source={{ uri: face.content }}
          style={styles.faceImage}
          contentFit="contain"
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dice: {
    width: 120,
    height: 120,
    borderRadius: 16,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    margin: SPACING.sm,
  },
  faceText: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    paddingHorizontal: SPACING.sm,
  },
  faceImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});
