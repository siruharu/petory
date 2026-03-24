import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { InlineMessage } from '../feedback/inline-message';
import { FormSection } from './form-section';
import { TextField } from './text-field';
import type { CreateSchedulePayload, RecurrenceType, ScheduleType } from '../../types/domain';
import { colors, radius, spacing, typography } from '../../theme';

interface ScheduleFormProps {
  mode?: 'create' | 'edit';
  values: Partial<CreateSchedulePayload>;
  onChange: (field: keyof CreateSchedulePayload, value: string) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
  onSubmit?: () => void;
}

export function ScheduleForm({
  mode = 'create',
  values,
  onChange,
  isSubmitting = false,
  submitError = null,
  onSubmit,
}: ScheduleFormProps) {
  const type = (values.type as ScheduleType | undefined) ?? 'custom';
  const recurrenceType = (values.recurrenceType as RecurrenceType | undefined) ?? 'none';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === 'create' ? '새 일정 입력' : '일정 수정'}</Text>
      <FormSection title="대상과 종류" description="어떤 반려동물의 어떤 일정인지 먼저 정리합니다.">
        <TextField
          label="반려동물 ID"
          placeholder="Pet ID"
          value={values.petId ?? ''}
          onChangeText={(value) => onChange('petId', value)}
        />
        <TextField
          label="일정 종류"
          placeholder="custom"
          value={type}
          onChangeText={(value) => onChange('type', value)}
        />
        <TextField
          label="제목"
          placeholder="예: 예방접종 예약"
          value={values.title ?? ''}
          onChangeText={(value) => onChange('title', value)}
        />
      </FormSection>
      <FormSection title="시각과 반복" description="실행해야 할 시점과 반복 여부를 입력합니다.">
        <TextField
          label="예정 시각"
          placeholder="YYYY-MM-DDTHH:mm:ss"
          value={values.dueAt ?? ''}
          onChangeText={(value) => onChange('dueAt', value)}
        />
        <TextField
          label="반복"
          placeholder="none / daily / weekly / monthly"
          value={recurrenceType}
          onChangeText={(value) => onChange('recurrenceType', value)}
        />
        <TextField
          label="메모"
          placeholder="메모가 있다면 남겨 주세요"
          value={values.note ?? ''}
          onChangeText={(value) => onChange('note', value)}
          multiline
        />
      </FormSection>
      {submitError ? <InlineMessage tone="error" message={submitError} /> : null}
      <Pressable onPress={onSubmit ?? (() => undefined)} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>
          {isSubmitting ? '저장 중...' : mode === 'create' ? '일정 등록' : '일정 저장'}
        </Text>
      </Pressable>
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
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.text.primary,
    paddingHorizontal: spacing.md,
  },
  submitButtonText: {
    color: colors.text.inverse,
    ...typography.label.large,
  },
});
