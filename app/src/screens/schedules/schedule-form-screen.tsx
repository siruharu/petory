import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScheduleForm } from '../../components/forms/schedule-form';
import { ScreenContainer } from '../../components/common/screen-container';
import { InlineMessage } from '../../components/feedback/inline-message';
import { createSchedule } from '../../features/schedules/schedule-api';
import type { CreateSchedulePayload } from '../../types/domain';
import { colors, spacing, typography } from '../../theme';

export function ScheduleFormScreen() {
  const [values, setValues] = useState<CreateSchedulePayload>({
    petId: '',
    type: 'custom',
    title: '',
    note: '',
    dueAt: '',
    recurrenceType: 'none',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(field: keyof CreateSchedulePayload, value: string) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit() {
    if (!values.petId || !values.title || !values.dueAt) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createSchedule(values);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create schedule');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>일정 생성</Text>
          <Text style={styles.title}>실행해야 할 돌봄 일정을 추가해요</Text>
          <Text style={styles.description}>
            반려동물, 일정 종류, 시각만 입력해도 홈과 일정 화면에 바로 반영됩니다.
          </Text>
        </View>
        {submitError ? <InlineMessage tone="error" message={submitError} /> : null}
      <ScheduleForm
        mode="create"
        values={values}
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
});
