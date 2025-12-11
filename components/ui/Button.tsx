import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme';
import { useDice } from '@/hooks/useDice';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({ 
  title, 
  onPress, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style 
}: ButtonProps) {
  const { theme } = useDice();

  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = {
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    const sizeStyles = {
      small: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md },
      medium: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },
      large: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl },
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: theme.primary,
        ...SHADOWS.glow(theme.primary),
      },
      secondary: {
        backgroundColor: theme.surface,
        borderWidth: 1,
        borderColor: theme.primary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.primary,
      },
      danger: {
        backgroundColor: '#FF3B30',
        ...SHADOWS.md,
      },
    };

    return {
      ...base,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled ? 0.5 : 1,
    };
  };

  const getTextStyle = (): TextStyle => {
    const variantTextStyles: Record<string, TextStyle> = {
      primary: { color: variant === 'primary' ? '#000000' : theme.text },
      secondary: { color: theme.primary },
      outline: { color: theme.primary },
      danger: { color: '#FFFFFF' },
    };

    return {
      ...TYPOGRAPHY.button,
      ...variantTextStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#000000' : theme.primary} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
