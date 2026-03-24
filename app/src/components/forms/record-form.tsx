import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { InlineMessage } from '../feedback/inline-message';
import { FormSection } from './form-section';
import { TextField } from './text-field';
import type { CreateRecordPayload, RecordType } from '../../types/domain';
import { colors, radius, spacing, typography } from '../../theme';

interface RecordFormProps {
  mode?: 'create' | 'edit';
  values: Partial<CreateRecordPayload>;
  onChange: (field: keyof CreateRecordPayload, value: string) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
  onSubmit?: () => void;
}

export function RecordForm({
  mode = 'create',
  values,
  onChange,
  isSubmitting = false,
  submitError = null,
  onSubmit,
}: RecordFormProps) {
  const type = (values.type as RecordType | undefined) ?? 'memo';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === 'create' ? '새 기록 입력' : '기록 수정'}</Text>
      <FormSection title="기록 기본 정보" description="무슨 기록인지와 언제 발생했는지 입력합니다.">
        <TextField
          label="반려동물 ID"
          placeholder="Pet ID"
          value={values.petId ?? ''}
          onChangeText={(value) => onChange('petId', value)}
        />
        <TextField
          label="기록 종류"
          placeholder="memo / weight / vet_visit_memo"
          value={type}
          onChangeText={(value) => onChange('type', value)}
        />
        <TextField
          label="제목"
          placeholder="예: 병원 방문 메모"
          value={values.title ?? ''}
          onChangeText={(value) => onChange('title', value)}
        />
        <TextField
          label="발생 시각"
          placeholder="YYYY-MM-DDTHH:mm:ss"
          value={values.occurredAt ?? ''}
          onChangeText={(value) => onChange('occurredAt', value)}
        />
      </FormSection>
      <FormSection title="상세 내용" description="메모와 측정값은 기록 종류에 맞게 채웁니다.">
        <TextField
          label="메모 / 병원 메모"
          placeholder="기록 내용을 남겨 주세요"
          value={values.note ?? ''}
          onChangeText={(value) => onChange('note', value)}
          multiline
        />
        <TextField
          label="값"
          placeholder="예: 4.2"
          value={values.value != null ? String(values.value) : ''}
          onChangeText={(value) => onChange('value', value)}
        />
        <TextField
          label="단위"
          placeholder="예: kg"
          value={values.unit ?? ''}
          onChangeText={(value) => onChange('unit', value)}
        />
      </FormSection>
      {submitError ? <InlineMessage tone="error" message={submitError} /> : null}
      <Pressable onPress={onSubmit ?? (() => undefined)} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>
          {isSubmitting ? '저장 중...' : mode === 'create' ? '기록 저장' : '기록 수정 저장'}
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
