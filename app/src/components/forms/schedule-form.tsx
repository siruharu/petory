import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { InlineMessage } from '../feedback/inline-message';
import { FormSection } from './form-section';
import { DatePickerField } from './date-picker-field';
import { SelectField } from './select-field';
import { TextField } from './text-field';
import type { CreateSchedulePayload, Pet, RecurrenceType, ScheduleType } from '../../types/domain';
import { colors, radius, spacing, typography } from '../../theme';
import type { SelectOption } from './pet-form-options';

const scheduleTypeOptions: SelectOption<ScheduleType>[] = [
  { label: '예방접종', value: 'vaccination' },
  { label: '예방 관리', value: 'prevention' },
  { label: '약 복용', value: 'medication' },
  { label: '병원 방문', value: 'vet_visit' },
  { label: '직접 입력', value: 'custom' },
];

const recurrenceOptions: SelectOption<RecurrenceType>[] = [
  { label: '반복 없음', value: 'none' },
  { label: '매일', value: 'daily' },
  { label: '매주', value: 'weekly' },
  { label: '매월', value: 'monthly' },
];

type ScheduleFieldErrorKey = 'petId' | 'type' | 'title' | 'dueDate' | 'dueTime' | 'recurrenceType';
type EditableScheduleField = 'type' | 'title' | 'note' | 'recurrenceType';

interface ScheduleFormProps {
  mode?: 'create' | 'edit';
  values: Partial<CreateSchedulePayload>;
  onChange: (field: EditableScheduleField, value: string) => void;
  pets?: Pet[];
  selectedPetId?: string;
  selectedPetName?: string | null;
  onPetChange?: (value: string) => void;
  dueDate: string;
  dueTime: string;
  onDueDateChange: (value: string) => void;
  onDueTimeChange: (value: string) => void;
  fieldErrors?: Partial<Record<ScheduleFieldErrorKey, string>>;
  isSubmitting?: boolean;
  submitError?: string | null;
  onSubmit?: () => void;
}

export function ScheduleForm({
  mode = 'create',
  values,
  onChange,
  pets = [],
  selectedPetId,
  selectedPetName,
  onPetChange,
  dueDate,
  dueTime,
  onDueDateChange,
  onDueTimeChange,
  fieldErrors,
  isSubmitting = false,
  submitError = null,
  onSubmit,
}: ScheduleFormProps) {
  const type = (values.type as ScheduleType | undefined) ?? 'custom';
  const recurrenceType = (values.recurrenceType as RecurrenceType | undefined) ?? 'none';
  const petOptions: SelectOption<string>[] = pets.map((pet) => ({
    label: pet.name,
    value: pet.id,
  }));
  const shouldShowPetPicker = petOptions.length > 1;
  const petHelperText = fieldErrors?.petId
    ? fieldErrors.petId
    : shouldShowPetPicker
      ? '일정을 등록할 반려동물을 선택해 주세요.'
      : selectedPetName?.trim()
        ? '현재 반려동물이 일정 대상으로 자동 지정됩니다.'
        : '반려동물을 먼저 선택해 주세요.';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === 'create' ? '새 일정 입력' : '일정 수정'}</Text>
      <FormSection title="대상과 종류" description="어떤 반려동물의 어떤 일정인지 먼저 정리합니다.">
        {shouldShowPetPicker ? (
          <SelectField
            label="대상 반려동물"
            placeholder="반려동물을 선택해 주세요"
            value={selectedPetId}
            options={petOptions}
            helperText={petHelperText}
            onChange={(value) => onPetChange?.(value)}
          />
        ) : (
          <View style={styles.readonlyField}>
            <Text style={styles.readonlyLabel}>대상 반려동물</Text>
            <Text style={styles.readonlyValue}>
              {selectedPetName?.trim() ? selectedPetName : '반려동물을 먼저 선택해 주세요.'}
            </Text>
            <Text style={styles.readonlyHelper}>{petHelperText}</Text>
          </View>
        )}
        <SelectField
          label="일정 종류"
          placeholder="일정 종류를 선택해 주세요"
          value={type}
          options={scheduleTypeOptions}
          helperText="예방, 복약, 병원 방문처럼 반복될 수 있는 돌봄을 구분합니다."
          onChange={(value) => onChange('type', value)}
        />
        <TextField
          label="제목"
          placeholder="예: 예방접종 예약"
          value={values.title ?? ''}
          onChangeText={(value) => onChange('title', value)}
          errorMessage={fieldErrors?.title ?? null}
        />
      </FormSection>
      <FormSection title="시각과 반복" description="실행해야 할 시점과 반복 여부를 입력합니다.">
        <DatePickerField
          label="예정 날짜"
          value={dueDate}
          helperText={fieldErrors?.dueDate ?? '달력에서 실행 날짜를 선택해 주세요.'}
          onChange={onDueDateChange}
        />
        <TextField
          label="예정 시간"
          placeholder="09:00"
          value={dueTime}
          onChangeText={onDueTimeChange}
          helperText="24시간 형식 `HH:mm`로 입력해 주세요."
          errorMessage={fieldErrors?.dueTime ?? null}
        />
        <SelectField
          label="반복"
          placeholder="반복 주기를 선택해 주세요"
          value={recurrenceType}
          options={recurrenceOptions}
          onChange={(value) => onChange('recurrenceType', value)}
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
  readonlyField: {
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: radius.md,
    backgroundColor: colors.surface.subtle,
  },
  readonlyLabel: {
    color: colors.text.primary,
    ...typography.label.medium,
  },
  readonlyValue: {
    color: colors.text.secondary,
    ...typography.body.medium,
  },
  readonlyHelper: {
    color: colors.text.secondary,
    ...typography.body.small,
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
