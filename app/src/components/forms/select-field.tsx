import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import type { SelectOption } from './pet-form-options';

interface SelectFieldProps<T extends string> {
  label?: string;
  value?: T | null;
  options: SelectOption<T>[];
  placeholder?: string;
  helperText?: string;
  onChange: (value: T) => void;
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  placeholder = '선택해 주세요',
  helperText,
  onChange,
}: SelectFieldProps<T>) {
  const [expanded, setExpanded] = useState(false);
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable onPress={() => setExpanded((current) => !current)} style={styles.trigger}>
        <Text style={[styles.triggerText, !selectedOption ? styles.placeholderText : null]}>
          {selectedOption?.label ?? placeholder}
        </Text>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </Pressable>
      {expanded ? (
        <View style={styles.optionList}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => {
                onChange(option.value);
                setExpanded(false);
              }}
              style={[
                styles.optionButton,
                option.value === value ? styles.optionButtonSelected : null,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  option.value === value ? styles.optionTextSelected : null,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
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
    gap: spacing.sm,
  },
  triggerText: {
    flex: 1,
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
  optionList: {
    gap: spacing.xs,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: radius.md,
    backgroundColor: colors.surface.elevated,
  },
  optionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface.default,
  },
  optionButtonSelected: {
    backgroundColor: '#FFF3E8',
    borderWidth: 1,
    borderColor: '#F1C49D',
  },
  optionText: {
    color: colors.text.primary,
    ...typography.body.medium,
  },
  optionTextSelected: {
    color: colors.brand.primary,
    ...typography.label.large,
  },
  helperText: {
    color: colors.text.secondary,
    ...typography.body.small,
  },
});
