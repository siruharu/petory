import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

interface LoadingStateProps {
  title?: string;
  description?: string;
  blocks?: number;
}

export function LoadingState({
  title = '불러오는 중',
  description = '잠시만 기다려 주세요.',
  blocks = 3,
}: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.blockGroup}>
        {Array.from({ length: blocks }).map((_, index) => (
          <View key={index} style={styles.block} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  title: {
    color: colors.text.primary,
    ...typography.title.medium,
  },
  description: {
    color: colors.text.secondary,
    ...typography.body.medium,
  },
  blockGroup: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  block: {
    height: 88,
    borderRadius: radius.lg,
    backgroundColor: colors.surface.subtle,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
});
