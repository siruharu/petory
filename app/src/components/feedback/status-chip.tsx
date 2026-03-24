import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

type Tone = 'default' | 'success' | 'warning' | 'error' | 'info';

interface StatusChipProps {
  label: string;
  tone?: Tone;
}

const toneMap: Record<Tone, { backgroundColor: string; textColor: string }> = {
  default: {
    backgroundColor: colors.surface.subtle,
    textColor: colors.text.secondary,
  },
  success: {
    backgroundColor: '#E2EFE6',
    textColor: colors.state.success,
  },
  warning: {
    backgroundColor: '#FFF1DF',
    textColor: colors.state.warning,
  },
  error: {
    backgroundColor: '#FDE2DD',
    textColor: colors.state.error,
  },
  info: {
    backgroundColor: '#E7F0FC',
    textColor: colors.state.info,
  },
};

export function StatusChip({ label, tone = 'default' }: StatusChipProps) {
  const color = toneMap[tone];

  return (
    <View style={[styles.container, { backgroundColor: color.backgroundColor }]}>
      <Text style={[styles.label, { color: color.textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
  },
  label: {
    ...typography.label.medium,
  },
});
