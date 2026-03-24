import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

interface DatePickerFieldProps {
  label?: string;
  value?: string | null;
  helperText?: string;
  onChange: (value: string) => void;
}

function createMonthMatrix(baseDate: Date) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const startDate = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }).map((_, index) => {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + index);
    return current;
  });
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function DatePickerField({
  label,
  value,
  helperText,
  onChange,
}: DatePickerFieldProps) {
  const [expanded, setExpanded] = useState(false);
  const selectedDate = useMemo(() => parseDate(value), [value]);
  const [visibleMonth, setVisibleMonth] = useState(() => selectedDate ?? new Date());
  const monthDates = useMemo(() => createMonthMatrix(visibleMonth), [visibleMonth]);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable
        onPress={() => setExpanded((current) => !current)}
        style={styles.trigger}
      >
        <Text style={[styles.triggerText, !value ? styles.placeholderText : null]}>
          {value || '생일을 선택해 주세요'}
        </Text>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </Pressable>
      {expanded ? (
        <View style={styles.panel}>
          <View style={styles.calendarHeader}>
            <Pressable
              onPress={() =>
                setVisibleMonth(
                  (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
                )
              }
            >
              <Text style={styles.calendarButton}>{'<'}</Text>
            </Pressable>
            <Text style={styles.calendarTitle}>
              {visibleMonth.getFullYear()}년 {visibleMonth.getMonth() + 1}월
            </Text>
            <Pressable
              onPress={() =>
                setVisibleMonth(
                  (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
                )
              }
            >
              <Text style={styles.calendarButton}>{'>'}</Text>
            </Pressable>
          </View>
          <View style={styles.weekdays}>
            {['일', '월', '화', '수', '목', '금', '토'].map((weekday) => (
              <Text key={weekday} style={styles.weekdayText}>
                {weekday}
              </Text>
            ))}
          </View>
          <View style={styles.dateGrid}>
            {monthDates.map((date) => {
              const isCurrentMonth = date.getMonth() === visibleMonth.getMonth();
              const isSelected = value === formatDate(date);

              return (
                <Pressable
                  key={`${date.toISOString()}-${isCurrentMonth}`}
                  onPress={() => {
                    onChange(formatDate(date));
                    setExpanded(false);
                  }}
                  style={[
                    styles.dateCell,
                    isSelected ? styles.dateCellSelected : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateCellText,
                      !isCurrentMonth ? styles.dateCellTextDimmed : null,
                      isSelected ? styles.dateCellTextSelected : null,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    color: colors.text.primary,
    ...typography.label.medium,
  },
  trigger: {
    minHeight: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: radius.md,
    backgroundColor: colors.surface.default,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerText: {
    color: colors.text.primary,
    ...typography.body.large,
  },
  placeholderText: {
    color: colors.text.tertiary,
  },
  chevron: {
    color: colors.text.secondary,
    ...typography.label.medium,
  },
  panel: {
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: radius.md,
    backgroundColor: colors.surface.elevated,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendarButton: {
    color: colors.brand.primary,
    ...typography.label.large,
  },
  calendarTitle: {
    color: colors.text.primary,
    ...typography.title.medium,
  },
  weekdays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekdayText: {
    width: '14.2%',
    textAlign: 'center',
    color: colors.text.secondary,
    ...typography.body.small,
  },
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xxs,
  },
  dateCell: {
    width: '13.5%',
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.surface.default,
  },
  dateCellSelected: {
    backgroundColor: colors.brand.primary,
  },
  dateCellText: {
    color: colors.text.primary,
    ...typography.body.small,
  },
  dateCellTextDimmed: {
    color: colors.text.tertiary,
  },
  dateCellTextSelected: {
    color: colors.text.inverse,
    ...typography.label.medium,
  },
  helperText: {
    color: colors.text.secondary,
    ...typography.body.small,
  },
});
