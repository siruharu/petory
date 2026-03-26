import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScheduleForm } from '../../components/forms/schedule-form';
import { ScreenContainer } from '../../components/common/screen-container';
import { InlineMessage } from '../../components/feedback/inline-message';
import { createSchedule } from '../../features/schedules/schedule-api';
import { ApiError } from '../../services/api/client';
import type { CreateSchedulePayload, Pet, Schedule } from '../../types/domain';
import { colors, radius, spacing, typography } from '../../theme';

type ScheduleFieldErrorKey = 'petId' | 'type' | 'title' | 'dueDate' | 'dueTime' | 'recurrenceType';

interface ScheduleFormScreenProps {
  selectedPetId?: string;
  selectedPetName?: string;
  pets?: Pet[];
  onCancel?: () => void;
  onSuccess?: (schedule: Schedule) => void;
}

function normalizeTimeInput(value: string) {
  return value.replace(/[^0-9:]/g, '').slice(0, 5);
}

function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

function buildDueAt(date: string, time: string) {
  if (!date || !isValidTime(time)) {
    return null;
  }

  const localDateTime = new Date(`${date}T${time}:00`);
  if (Number.isNaN(localDateTime.getTime())) {
    return null;
  }

  return localDateTime.toISOString();
}

export function ScheduleFormScreen({
  selectedPetId,
  selectedPetName,
  pets = [],
  onCancel,
  onSuccess,
}: ScheduleFormScreenProps) {
  const [values, setValues] = useState<Omit<CreateSchedulePayload, 'petId' | 'dueAt'>>({
    type: 'custom',
    title: '',
    note: '',
    recurrenceType: 'none',
  });
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('09:00');
  const [targetPetId, setTargetPetId] = useState<string | undefined>(selectedPetId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ScheduleFieldErrorKey, string>>>({});

  useEffect(() => {
    if (pets.length === 1) {
      setTargetPetId(pets[0]?.id);
      return;
    }

    if (pets.length > 1) {
      setTargetPetId((current) => {
        if (current && pets.some((pet) => pet.id === current)) {
          return current;
        }

        if (selectedPetId && pets.some((pet) => pet.id === selectedPetId)) {
          return selectedPetId;
        }

        return undefined;
      });
      return;
    }

    setTargetPetId(undefined);
  }, [pets, selectedPetId]);

  const resolvedPetName = useMemo(
    () => pets.find((pet) => pet.id === targetPetId)?.name ?? selectedPetName,
    [pets, selectedPetName, targetPetId],
  );

  function handleChange(field: keyof Omit<CreateSchedulePayload, 'petId' | 'dueAt'>, value: string) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    if (field === 'title' || field === 'type' || field === 'recurrenceType') {
      setFieldErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  }

  function handlePetChange(value: string) {
    setTargetPetId(value);
    setFieldErrors((current) => ({
      ...current,
      petId: undefined,
    }));
    setSubmitError(null);
  }

  async function handleSubmit() {
    if (!targetPetId) {
      const petSelectionError =
        pets.length > 1
          ? '일정을 등록할 반려동물을 선택해 주세요.'
          : '일정을 등록할 반려동물을 먼저 준비해 주세요.';

      setFieldErrors((current) => ({
        ...current,
        petId: petSelectionError,
      }));
      setSubmitError(petSelectionError);
      return;
    }

    const nextFieldErrors: Partial<Record<ScheduleFieldErrorKey, string>> = {};

    if (!values.title.trim()) {
      nextFieldErrors.title = '제목을 입력해 주세요.';
    }

    if (!dueDate) {
      nextFieldErrors.dueDate = '예정 날짜를 선택해 주세요.';
    }

    if (!dueTime) {
      nextFieldErrors.dueTime = '예정 시간을 입력해 주세요.';
    } else if (!isValidTime(dueTime)) {
      nextFieldErrors.dueTime = '예정 시간은 `HH:mm` 형식으로 입력해 주세요.';
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    const dueAt = buildDueAt(dueDate, dueTime);
    if (!dueAt) {
      setFieldErrors((current) => ({
        ...current,
        dueTime: '유효한 날짜와 시간을 입력해 주세요.',
      }));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});

    try {
      const createdSchedule = await createSchedule({
        petId: targetPetId,
        type: values.type,
        title: values.title.trim(),
        note: values.note?.trim() ? values.note.trim() : null,
        dueAt,
        recurrenceType: values.recurrenceType,
      });
      onSuccess?.(createdSchedule);
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        const titleFieldError = error.fieldErrors.title;
        setFieldErrors((current) => ({
          ...current,
          title: titleFieldError ?? current.title,
        }));
      }

      setSubmitError(error instanceof Error ? error.message : 'Failed to create schedule');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenContainer scrollable>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>일정 생성</Text>
          <Text style={styles.title}>실행해야 할 돌봄 일정을 추가해요</Text>
          <Text style={styles.description}>
            선택한 반려동물을 기준으로 일정 종류와 시각을 정하면 홈과 일정 화면에 바로 반영됩니다.
          </Text>
        </View>
        {onCancel ? (
          <View style={styles.actions}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>일정 목록으로 돌아가기</Text>
            </Pressable>
          </View>
        ) : null}
        {submitError ? <InlineMessage tone="error" message={submitError} /> : null}
        <ScheduleForm
          mode="create"
          values={values}
          pets={pets}
          selectedPetId={targetPetId}
          selectedPetName={resolvedPetName}
          dueDate={dueDate}
          dueTime={dueTime}
          onPetChange={handlePetChange}
          onDueDateChange={(value) => {
            setDueDate(value);
            setFieldErrors((current) => ({
              ...current,
              dueDate: undefined,
            }));
          }}
          onDueTimeChange={(value) => {
            setDueTime(normalizeTimeInput(value));
            setFieldErrors((current) => ({
              ...current,
              dueTime: undefined,
            }));
          }}
          fieldErrors={fieldErrors}
          onChange={handleChange}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onSubmit={() => void handleSubmit()}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  eyebrow: {
    color: colors.brand.primary,
    ...typography.label.large,
  },
  title: {
    color: colors.text.primary,
    ...typography.title.xlarge,
  },
  description: {
    color: colors.text.secondary,
    ...typography.body.large,
  },
  cancelButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.default,
  },
  cancelButtonText: {
    color: colors.text.primary,
    ...typography.label.large,
  },
});
