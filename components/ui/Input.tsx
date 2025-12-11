import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useDice } from '@/hooks/useDice';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const { theme } = useDice();

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      ) : null}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.surface,
            borderColor: error ? '#FF3B30' : theme.border,
            color: theme.text,
          },
          style,
        ]}
        placeholderTextColor={theme.textSecondary}
        {...props}
      />
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    ...TYPOGRAPHY.body,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  error: {
    ...TYPOGRAPHY.caption,
    color: '#FF3B30',
    marginTop: SPACING.xs,
  },
});
