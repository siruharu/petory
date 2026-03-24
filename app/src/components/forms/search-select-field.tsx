import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { TextField } from './text-field';

interface SearchSelectFieldProps {
  label?: string;
  value?: string | null;
  options: string[];
  placeholder?: string;
  helperText?: string;
  onChange: (value: string) => void;
}

export function SearchSelectField({
  label,
  value,
  options,
  placeholder = '검색하거나 선택해 주세요',
  helperText,
  onChange,
}: SearchSelectFieldProps) {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) => option.toLowerCase().includes(normalizedQuery));
  }, [options, query]);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable onPress={() => setExpanded((current) => !current)} style={styles.trigger}>
        <View style={styles.triggerContent}>
          <Text style={styles.triggerLabel}>현재 선택</Text>
          <Text style={[styles.triggerText, !value ? styles.placeholderText : null]}>
            {value || placeholder}
          </Text>
        </View>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </Pressable>
      {expanded ? (
        <View style={styles.panel}>
          <View style={styles.searchSection}>
            <Text style={styles.sectionLabel}>품종 검색</Text>
            <TextField
              placeholder="품종 검색"
              value={query}
              onChangeText={setQuery}
            />
          </View>
          <View style={styles.optionsSection}>
            <View style={styles.optionsHeader}>
              <Text style={styles.sectionLabel}>선택 가능한 품종</Text>
              <Text style={styles.optionsCount}>{filteredOptions.length}개</Text>
            </View>
            <ScrollView style={styles.optionList} contentContainerStyle={styles.optionListContent}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => {
                      onChange(option);
                      setExpanded(false);
                      setQuery('');
                    }}
                    style={[
                      styles.optionButton,
                      option === value ? styles.optionButtonSelected : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        option === value ? styles.optionTextSelected : null,
                      ]}
                    >
                      {option}
                    </Text>
                    {option === value ? <Text style={styles.optionCheck}>선택됨</Text> : null}
                  </Pressable>
                ))
              ) : (
                <Text style={styles.emptyText}>검색 결과가 없어요.</Text>
              )}
            </ScrollView>
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
    minHeight: 64,
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
  triggerContent: {
    flex: 1,
    gap: spacing.xxs,
  },
  triggerLabel: {
    color: colors.text.secondary,
    ...typography.body.small,
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
  panel: {
    gap: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: radius.md,
    backgroundColor: colors.surface.elevated,
  },
  searchSection: {
    gap: spacing.xs,
  },
  optionsSection: {
    gap: spacing.xs,
  },
  optionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  sectionLabel: {
    color: colors.text.primary,
    ...typography.label.medium,
  },
  optionsCount: {
    color: colors.text.secondary,
    ...typography.body.small,
  },
  optionList: {
    maxHeight: 220,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: radius.md,
    backgroundColor: colors.surface.default,
  },
  optionListContent: {
    gap: spacing.xs,
    padding: spacing.xs,
  },
  optionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface.default,
    borderWidth: 1,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  optionButtonSelected: {
    backgroundColor: '#FFF3E8',
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
  optionCheck: {
    color: colors.brand.primary,
    ...typography.body.small,
  },
  emptyText: {
    color: colors.text.secondary,
    ...typography.body.small,
  },
  helperText: {
    color: colors.text.secondary,
    ...typography.body.small,
  },
});
