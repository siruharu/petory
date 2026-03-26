import React, { useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { FormSection } from './form-section';
import { DatePickerField } from './date-picker-field';
import {
  breedOptionsBySpecies,
  neuteredStatusOptions,
  petSexOptions,
  speciesOptions,
} from './pet-form-options';
import { SearchSelectField } from './search-select-field';
import { SelectField } from './select-field';
import { TextField } from './text-field';
import { InlineMessage } from '../feedback/inline-message';
import type { CreatePetPayload, Species, UpdatePetPayload } from '../../types/domain';
import { colors, radius, spacing, typography } from '../../theme';

type PetFormValues = Partial<CreatePetPayload & UpdatePetPayload>;

interface PetFormProps {
  mode?: 'create' | 'edit';
  values: PetFormValues;
  weightValue?: string;
  photoName?: string | null;
  onChange: (field: keyof CreatePetPayload, value: string) => void;
  onPickPhoto?: () => void;
  onClearPhoto?: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
  onSubmit?: () => void;
}

export function PetForm({
  mode = 'create',
  values,
  weightValue = '',
  photoName = null,
  onChange,
  onPickPhoto,
  onClearPhoto,
  isSubmitting = false,
  submitError = null,
  onSubmit,
}: PetFormProps) {
  const selectedSpecies = (values.species as Species | undefined) ?? 'dog';
  const breedOptions = breedOptionsBySpecies[selectedSpecies];
  const [imagePreviewFailed, setImagePreviewFailed] = useState(false);
  const photoUrl = values.photoUrl?.trim() ?? '';

  React.useEffect(() => {
    setImagePreviewFailed(false);
  }, [photoUrl]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === 'create' ? '기본 정보 입력' : '기본 정보 수정'}</Text>
      <FormSection title="기본 정보" description="이름과 종 정보만 입력해도 시작할 수 있어요.">
        <TextField
          label="이름"
          placeholder="반려동물 이름"
          value={values.name ?? ''}
          onChangeText={(value) => onChange('name', value)}
        />
        <SelectField
          label="종"
          placeholder="종을 선택해 주세요"
          value={selectedSpecies}
          options={speciesOptions}
          onChange={(value) => onChange('species', value)}
        />
        <SearchSelectField
          label="품종"
          placeholder="품종을 선택하거나 검색해 주세요"
          value={values.breed ?? ''}
          options={breedOptions}
          helperText={`${selectedSpecies === 'dog' ? '강아지' : '고양이'} 대표 품종 기준으로 보여줍니다.`}
          onChange={(value) => onChange('breed', value)}
        />
        <SelectField
          label="성별"
          placeholder="성별을 선택해 주세요"
          value={values.sex ?? null}
          options={petSexOptions}
          onChange={(value) => onChange('sex', value)}
        />
      </FormSection>
      <FormSection title="건강/메모" description="나이, 체중, 메모는 홈 화면과 기록 흐름에서 도움을 줍니다.">
        <SelectField
          label="중성화 상태"
          placeholder="중성화 상태를 선택해 주세요"
          value={values.neuteredStatus ?? null}
          options={neuteredStatusOptions}
          onChange={(value) => onChange('neuteredStatus', value)}
        />
        <DatePickerField
          label="생일"
          value={values.birthDate ?? ''}
          helperText="달력에서 날짜를 누르면 바로 선택됩니다."
          onChange={(value) => onChange('birthDate', value)}
        />
        <View style={styles.readonlyField}>
          <Text style={styles.readonlyLabel}>현재 나이</Text>
          <Text style={styles.readonlyValue}>
            {values.ageText?.trim() ? values.ageText : '생일을 선택하면 자동 계산됩니다.'}
          </Text>
        </View>
        <TextField
          label="체중"
          placeholder="예: 4.2"
          value={weightValue}
          onChangeText={(value) => onChange('weight', value)}
          keyboardType="decimal-pad"
          helperText="소수점 둘째 자리까지 입력할 수 있어요."
        />
        <TextField
          label="메모"
          placeholder="특이사항을 기록해 주세요"
          value={values.note ?? ''}
          onChangeText={(value) => onChange('note', value)}
          multiline
        />
        <View style={styles.photoActionsCard}>
          <View style={styles.photoActionsHeader}>
            <Text style={styles.photoPreviewLabel}>프로필 이미지</Text>
            <Text style={styles.photoHelperText}>
              {Platform.OS === 'web'
                ? '파일을 직접 선택해 등록할 수 있어요.'
                : '기기 사진 보관함에서 이미지를 선택해 등록할 수 있어요.'}
            </Text>
          </View>
          <View style={styles.photoActions}>
            <Pressable
              onPress={onPickPhoto ?? (() => undefined)}
              style={styles.photoActionButton}
            >
              <Text style={styles.photoActionButtonText}>이미지 파일 선택</Text>
            </Pressable>
            {values.photoUrl ? (
              <Pressable
                onPress={onClearPhoto ?? (() => undefined)}
                style={styles.photoSecondaryButton}
              >
                <Text style={styles.photoSecondaryButtonText}>이미지 지우기</Text>
              </Pressable>
            ) : null}
          </View>
          {photoName ? <Text style={styles.photoFileName}>선택한 파일: {photoName}</Text> : null}
          <TextField
            label="이미지 주소 직접 입력"
            placeholder="https://example.com/pet-photo.jpg"
            value={values.photoUrl ?? ''}
            onChangeText={(value) => onChange('photoUrl', value)}
            helperText="파일 선택이 어려운 경우에만 직접 입력해 주세요."
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View style={styles.photoPreviewCard}>
          <Text style={styles.photoPreviewLabel}>이미지 미리보기</Text>
          {photoUrl && !imagePreviewFailed ? (
            <Image
              source={{ uri: photoUrl }}
              style={styles.photoPreviewImage}
              resizeMode="cover"
              onError={() => setImagePreviewFailed(true)}
            />
          ) : (
            <View style={styles.photoPreviewPlaceholder}>
              <Text style={styles.photoPreviewPlaceholderText}>
                {photoUrl && imagePreviewFailed
                  ? '이미지를 불러오지 못했어요. URL을 다시 확인해 주세요.'
                  : '이미지 URL을 입력하면 여기에서 미리보기를 확인할 수 있어요.'}
              </Text>
            </View>
          )}
        </View>
      </FormSection>
      {submitError ? <InlineMessage tone="error" message={submitError} /> : null}
      <Pressable onPress={onSubmit ?? (() => undefined)} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>
          {isSubmitting ? '저장 중...' : mode === 'create' ? '반려동물 등록' : '반려동물 저장'}
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
  photoPreviewCard: {
    gap: spacing.xs,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: radius.md,
    backgroundColor: colors.surface.subtle,
  },
  photoPreviewLabel: {
    color: colors.text.primary,
    ...typography.label.medium,
  },
  photoActionsCard: {
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: radius.md,
    backgroundColor: colors.surface.subtle,
  },
  photoActionsHeader: {
    gap: spacing.xxs,
  },
  photoHelperText: {
    color: colors.text.secondary,
    ...typography.body.small,
  },
  photoActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  photoActionButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.text.primary,
  },
  photoActionButtonText: {
    color: colors.text.inverse,
    ...typography.label.medium,
  },
  photoSecondaryButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.default,
  },
  photoSecondaryButtonText: {
    color: colors.text.primary,
    ...typography.label.medium,
  },
  photoFileName: {
    color: colors.text.secondary,
    ...typography.body.small,
  },
  photoPreviewImage: {
    width: '100%',
    height: 220,
    borderRadius: radius.md,
    backgroundColor: colors.surface.default,
  },
  photoPreviewPlaceholder: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderStyle: 'dashed',
    backgroundColor: colors.surface.default,
    padding: spacing.md,
  },
  photoPreviewPlaceholderText: {
    color: colors.text.secondary,
    textAlign: 'center',
    ...typography.body.medium,
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
