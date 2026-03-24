import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

type Tone = 'info' | 'success' | 'error';

interface InlineMessageProps {
  tone?: Tone;
  message: string;
}

const toneStyles: Record<Tone, { backgroundColor: string; borderColor: string; textColor: string }> = {
  info: {
    backgroundColor: '#EEF5FF',
    borderColor: '#D3E3FA',
    textColor: colors.state.info,
  },
  success: {
    backgroundColor: '#EEF8F1',
    borderColor: '#CFE8D7',
    textColor: colors.state.success,
  },
  error: {
    backgroundColor: '#FFF3F1',
    borderColor: '#F2C6BF',
    textColor: colors.state.error,
  },
};

export function InlineMessage({ tone = 'info', message }: InlineMessageProps) {
  const toneStyle = toneStyles[tone];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: toneStyle.backgroundColor,
          borderColor: toneStyle.borderColor,
        },
      ]}
    >
      <Text style={[styles.text, { color: toneStyle.textColor }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    ...typography.body.medium,
  },
});
