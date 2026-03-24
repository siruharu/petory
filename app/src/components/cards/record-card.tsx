import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { RecordItem } from '../../types/domain';
import { colors, radius, spacing, typography } from '../../theme';

export function RecordCard({ record }: { record: RecordItem }) {
  const highlight =
    record.value != null && record.unit
      ? `${record.value}${record.unit}`
      : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{record.title}</Text>
          <Text style={styles.meta}>
            {record.type} · {record.occurredAt}
          </Text>
        </View>
        {highlight ? <Text style={styles.highlight}>{highlight}</Text> : null}
      </View>
      {record.note ? <Text style={styles.note}>{record.note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  titleBlock: {
    flex: 1,
    gap: spacing.xxs,
  },
  title: {
    color: colors.text.primary,
    ...typography.title.medium,
  },
  meta: {
    color: colors.text.secondary,
    ...typography.body.small,
  },
  highlight: {
    color: colors.brand.primary,
    ...typography.title.medium,
  },
  note: {
    color: colors.text.primary,
    ...typography.body.medium,
  },
});
