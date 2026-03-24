import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SectionHeader } from '../../components/common/section-header';
import { ScreenContainer } from '../../components/common/screen-container';
import { EmptyState } from '../../components/feedback/empty-state';
import { ErrorState } from '../../components/feedback/error-state';
import { LoadingState } from '../../components/feedback/loading-state';
import { fetchPets } from '../../features/pets/pet-api';
import type { Pet } from '../../types/domain';
import { colors, radius, spacing, typography } from '../../theme';

interface PetListScreenProps {
  onCreatePet?: () => void;
  onBackHome?: () => void;
}

export function PetListScreen({ onCreatePet, onBackHome }: PetListScreenProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading');
  const [pets, setPets] = useState<Pet[]>([]);

  async function loadPets(cancelled = false) {
    setStatus('loading');

    try {
      const result = await fetchPets();
      if (cancelled) {
        return;
      }

      setPets(result);
      setStatus(result.length === 0 ? 'empty' : 'success');
    } catch {
      if (cancelled) {
        return;
      }

      setPets([]);
      setStatus('error');
    }
  }

  useEffect(() => {
    let cancelled = false;
    void loadPets(cancelled);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <SectionHeader
          eyebrow="반려동물"
          title="등록된 반려동물을 한눈에 관리해요"
          description="대시보드에서 확인한 반려동물을 여기에서 등록하고 관리할 수 있어요."
        />
        <View style={styles.actions}>
          {onBackHome ? (
            <Pressable style={styles.secondaryButton} onPress={onBackHome}>
              <Text style={styles.secondaryButtonText}>홈으로 돌아가기</Text>
            </Pressable>
          ) : null}
          {onCreatePet ? (
            <Pressable style={styles.primaryButton} onPress={onCreatePet}>
              <Text style={styles.primaryButtonText}>새 반려동물 등록</Text>
            </Pressable>
          ) : null}
        </View>

        {status === 'loading' ? (
          <LoadingState
            title="반려동물을 불러오는 중"
            description="등록된 반려동물 정보를 정리하고 있어요."
            blocks={2}
          />
        ) : null}
        {status === 'error' ? (
          <ErrorState
            title="반려동물 정보를 불러오지 못했어요"
            description="잠시 후 다시 시도해 주세요."
            actionLabel="다시 시도"
            onAction={() => void loadPets()}
          />
        ) : null}
        {status === 'empty' ? (
          <EmptyState
            title="아직 등록된 반려동물이 없어요"
            description="첫 반려동물을 등록하면 일정과 기록을 시작할 수 있어요."
            actionLabel="첫 반려동물 등록"
            onAction={onCreatePet}
          />
        ) : null}
        {status === 'success'
          ? pets.map((pet) => (
              <View key={pet.id} style={styles.petCard}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petMeta}>
                  {[pet.species, pet.ageText, pet.breed].filter(Boolean).join(' · ')}
                </Text>
                {pet.note ? <Text style={styles.petNote}>{pet.note}</Text> : null}
              </View>
            ))
          : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  primaryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.text.primary,
  },
  primaryButtonText: {
    color: colors.text.inverse,
    ...typography.label.large,
  },
  secondaryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.default,
  },
  secondaryButtonText: {
    color: colors.text.primary,
    ...typography.label.large,
  },
  petCard: {
    gap: spacing.xxs,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.default,
  },
  petName: {
    color: colors.text.primary,
    ...typography.title.medium,
  },
  petMeta: {
    color: colors.text.secondary,
    ...typography.body.medium,
  },
  petNote: {
    color: colors.text.primary,
    ...typography.body.small,
  },
});
