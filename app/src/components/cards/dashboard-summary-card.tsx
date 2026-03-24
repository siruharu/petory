import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../theme';

interface DashboardSummaryCardProps {
  title: string;
  description: string;
  highlight?: string;
}

export function DashboardSummaryCard({
  title,
  description,
  highlight,
}: DashboardSummaryCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {highlight ? <Text style={styles.highlight}>{highlight}</Text> : null}
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: '#FFF6EF',
    borderWidth: 1,
    borderColor: '#F6D7BE',
    ...shadows.card,
  },
  title: {
    color: colors.text.primary,
    ...typography.title.medium,
  },
  highlight: {
    color: colors.brand.primary,
    ...typography.title.large,
  },
  description: {
    color: colors.text.secondary,
    ...typography.body.medium,
  },
});
