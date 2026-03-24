import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

interface FieldGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function FieldGroup({ title, description, children }: FieldGroupProps) {
  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {description ? <Text style={styles.description}>{description}</Text> : null}
      <View style={styles.fields}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.default,
  },
  title: {
    color: colors.text.primary,
    ...typography.title.medium,
  },
  description: {
    color: colors.text.secondary,
    ...typography.body.small,
  },
  fields: {
    gap: spacing.sm,
  },
});
