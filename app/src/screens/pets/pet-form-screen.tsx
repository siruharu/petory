import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PetForm } from '../../components/forms/pet-form';
import { ScreenContainer } from '../../components/common/screen-container';
import { InlineMessage } from '../../components/feedback/inline-message';
import { createPet, updatePet } from '../../features/pets/pet-api';
import type { CreatePetPayload, Pet } from '../../types/domain';
import { pickImageAsDataUrl } from '../../utils/image-picker';
import { calculatePetAgeText } from '../../utils/pet-age';
import { colors, radius, spacing, typography } from '../../theme';

type PetFormState = Omit<CreatePetPayload, 'weight'> & {
  weightDraft: string;
  photoName: string | null;
};

interface PetFormScreenProps {
  mode?: 'create' | 'edit';
  initialPet?: Pet | null;
  onSuccess?: (pet: Pet) => void;
  onCancel?: () => void;
}

function createInitialValues(initialPet?: Pet | null): PetFormState {
  if (!initialPet) {
    return {
      name: '',
      species: 'dog',
      breed: '',
      sex: 'unknown',
      neuteredStatus: 'unknown',
      birthDate: '',
      ageText: null,
      weightDraft: '',
      note: '',
      photoUrl: null,
      photoName: null,
    };
  }

  return {
    name: initialPet.name,
    species: initialPet.species,
    breed: initialPet.breed ?? '',
    sex: initialPet.sex ?? 'unknown',
    neuteredStatus: initialPet.neuteredStatus ?? 'unknown',
    birthDate: initialPet.birthDate ?? '',
    ageText: initialPet.ageText ?? calculatePetAgeText(initialPet.birthDate ?? ''),
    weightDraft: initialPet.weight != null ? String(initialPet.weight) : '',
    note: initialPet.note ?? '',
    photoUrl: initialPet.photoUrl ?? null,
    photoName: null,
  };
}

function isValidWeightDraft(value: string) {
  return /^\d*(\.\d{0,2})?$/.test(value);
}

function parseWeightDraft(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function toCreatePetPayload(values: PetFormState): CreatePetPayload {
  return {
    name: values.name,
    species: values.species,
    breed: values.breed,
    sex: values.sex,
    neuteredStatus: values.neuteredStatus,
    birthDate: values.birthDate,
    ageText: values.ageText,
    weight: parseWeightDraft(values.weightDraft),
    note: values.note,
    photoUrl: values.photoUrl,
  };
}

export function PetFormScreen({
  mode = 'create',
  initialPet = null,
  onSuccess,
  onCancel,
}: PetFormScreenProps) {
  const [values, setValues] = useState<PetFormState>(() => createInitialValues(initialPet));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setValues(createInitialValues(initialPet));
  }, [initialPet]);

  const isEditMode = mode === 'edit' && initialPet != null;
  const editingPetId = isEditMode ? initialPet.id : null;

  function handleChange(field: keyof CreatePetPayload, value: string) {
    if (field === 'weight') {
      if (!isValidWeightDraft(value)) {
        return;
      }

      setValues((current) => ({
        ...current,
        weightDraft: value,
      }));
      return;
    }

    setValues((current) => {
      const nextValues: PetFormState = {
        ...current,
        [field]: value,
      };

      if (field === 'photoUrl' && value !== current.photoUrl) {
        nextValues.photoName = null;
      }

      if (field === 'species' && nextValues.breed) {
        nextValues.breed = '';
      }

      if (field === 'birthDate') {
        nextValues.ageText = calculatePetAgeText(value);
      }

      return nextValues;
    });
  }

  async function handlePickPhoto() {
    try {
      const pickedImage = await pickImageAsDataUrl();

      if (!pickedImage) {
        return;
      }

      setSubmitError(null);
      setValues((current) => ({
        ...current,
        photoUrl: pickedImage.dataUrl,
        photoName: pickedImage.fileName,
      }));
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '이미지를 불러오지 못했어요.');
    }
  }

  function handleClearPhoto() {
    setValues((current) => ({
      ...current,
      photoUrl: null,
      photoName: null,
    }));
  }

  async function handleSubmit() {
    if (!values.name) {
      return;
    }

    const parsedWeight = parseWeightDraft(values.weightDraft);
    if (values.weightDraft.trim() && parsedWeight == null) {
      setSubmitError('체중은 소수점 둘째 자리까지 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = toCreatePetPayload(values);
      let savedPet: Pet;

      if (editingPetId) {
        savedPet = await updatePet(editingPetId, payload);
      } else {
        savedPet = await createPet(payload);
      }
      onSuccess?.(savedPet);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : isEditMode
            ? 'Failed to update pet'
            : 'Failed to create pet',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenContainer scrollable>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>반려동물 정보</Text>
          <Text style={styles.title}>{isEditMode ? '반려동물 정보를 수정해요' : '새 반려동물을 등록해요'}</Text>
          <Text style={styles.description}>
            기본 정보와 간단한 메모만 입력해도 홈과 일정 화면에서 더 정확하게 보여줄 수 있어요.
          </Text>
        </View>
        <View style={styles.actions}>
          {onCancel ? (
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>이전으로 돌아가기</Text>
            </Pressable>
          ) : null}
        </View>
        {submitError ? <InlineMessage tone="error" message={submitError} /> : null}
        <PetForm
          mode={isEditMode ? 'edit' : 'create'}
          values={values}
          weightValue={values.weightDraft}
          photoName={values.photoName}
          onChange={handleChange}
          onPickPhoto={() => void handlePickPhoto()}
          onClearPhoto={handleClearPhoto}
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
