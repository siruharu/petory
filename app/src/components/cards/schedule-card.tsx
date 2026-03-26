import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusChip } from '../feedback/status-chip';
import type { Schedule } from '../../types/domain';
import { colors, radius, spacing, typography } from '../../theme';

interface ScheduleCardProps {
  schedule: Schedule;
  isCompleting?: boolean;
  onComplete?: (scheduleId: string) => void;
}

export function ScheduleCard({
  schedule,
  isCompleting = false,
  onComplete,
}: ScheduleCardProps) {
  const isCompleted = schedule.status === 'completed';
  const isOverdue = schedule.status === 'overdue';

  return (
    <View
      style={[
        styles.container,
        isOverdue ? styles.overdueContainer : null,
        isCompleted ? styles.completedContainer : null,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{schedule.title}</Text>
          <Text style={styles.meta}>
            {schedule.type} · {schedule.dueAt}
          </Text>
        </View>
        <View
        >
          <StatusChip
            label={schedule.status}
            tone={isOverdue ? 'error' : isCompleted ? 'success' : 'default'}
          />
        </View>
      </View>

      {schedule.note ? <Text style={styles.note}>{schedule.note}</Text> : null}

      {!isCompleted ? (
        <Pressable
          onPress={() => onComplete?.(schedule.id)}
          disabled={isCompleting}
          style={[styles.completeButton, isCompleting ? styles.completeButtonDisabled : null]}
        >
          <Text style={styles.completeButtonText}>
            {isCompleting ? '완료 처리 중...' : '오늘 일정 완료'}
          </Text>
        </Pressable>
      ) : null}
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
  overdueContainer: {
    backgroundColor: '#FFF5F2',
    borderColor: '#F3CCC4',
  },
  completedContainer: {
    backgroundColor: '#F4F6F4',
  },
  header: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
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
  note: {
    color: colors.text.primary,
    ...typography.body.medium,
  },
  completeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    borderRadius: radius.md,
    backgroundColor: colors.text.primary,
    paddingHorizontal: spacing.md,
  },
  completeButtonDisabled: {
    opacity: 0.6,
  },
  completeButtonText: {
    color: colors.text.inverse,
    ...typography.label.large,
  },
});
