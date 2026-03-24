import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RecordForm } from '../../components/forms/record-form';
import { ScreenContainer } from '../../components/common/screen-container';
import { InlineMessage } from '../../components/feedback/inline-message';
import { createRecord } from '../../features/records/record-api';
import type { CreateRecordPayload } from '../../types/domain';
import { colors, spacing, typography } from '../../theme';

export function RecordFormScreen() {
  const [values, setValues] = useState<CreateRecordPayload>({
    petId: '',
    type: 'memo',
    title: '',
    note: '',
    occurredAt: '',
    value: null,
    unit: '',
    sourceScheduleId: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(field: keyof CreateRecordPayload, value: string) {
    setValues((current) => ({
      ...current,
      [field]: field === 'value' ? (value ? Number(value) : null) : value,
    }));
  }

  async function handleSubmit() {
    if (!values.petId || !values.title || !values.occurredAt) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createRecord(values);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create record');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>기록 생성</Text>
          <Text style={styles.title}>최근 상태를 기록으로 남겨요</Text>
          <Text style={styles.description}>
            간단한 메모나 체중 측정값만 입력해도 반려동물의 변화를 빠르게 추적할 수 있어요.
          </Text>
        </View>
        {submitError ? <InlineMessage tone="error" message={submitError} /> : null}
      <RecordForm
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
