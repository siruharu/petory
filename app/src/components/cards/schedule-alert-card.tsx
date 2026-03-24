import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

interface ScheduleAlertCardProps {
  count: number;
}

export function ScheduleAlertCard({ count }: ScheduleAlertCardProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>놓친 일정</Text>
      <Text style={styles.title}>{count}개의 일정이 아직 완료되지 않았어요</Text>
      <Text style={styles.description}>
        가장 먼저 처리해야 할 항목부터 다시 확인해 주세요.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: '#FFF2F0',
    borderWidth: 1,
    borderColor: '#F5CBC3',
  },
  eyebrow: {
    color: colors.state.error,
    ...typography.label.medium,
  },
  title: {
    color: colors.text.primary,
    ...typography.title.medium,
  },
  description: {
    color: colors.text.secondary,
    ...typography.body.medium,
  },
});
