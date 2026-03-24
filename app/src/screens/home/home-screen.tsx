import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SectionHeader } from '../../components/common/section-header';
import { DashboardSummaryCard } from '../../components/cards/dashboard-summary-card';
import { PetSummaryCard } from '../../components/cards/pet-summary-card';
import { ScheduleAlertCard } from '../../components/cards/schedule-alert-card';
import { EmptyState } from '../../components/feedback/empty-state';
import { ErrorState } from '../../components/feedback/error-state';
import { LoadingState } from '../../components/feedback/loading-state';
import { fetchHome } from '../../features/home/home-api';
import { PetSwitcherSheet } from '../pets/pet-switcher-sheet';
import type { HomeResponse } from '../../types/api';
import type { Pet, RecordItem, Schedule } from '../../types/domain';
import { colors, radius, spacing, typography } from '../../theme';

interface HomeScreenProps {
  pets?: Pet[];
  initialSelectedPetId?: string;
  refreshToken?: number;
  onOpenPets?: () => void;
  onCreatePet?: () => void;
}

function orderPetsForDisplay(pets: Pet[], selectedPetId?: string) {
  if (!selectedPetId) {
    return pets;
  }

  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  if (!selectedPet) {
    return pets;
  }

  return [selectedPet, ...pets.filter((pet) => pet.id !== selectedPetId)];
}

function mergePets(primaryPets: Pet[], secondaryPets: Pet[]): Pet[] {
  const petMap = new Map<string, Pet>();

  secondaryPets.forEach((pet) => {
    petMap.set(pet.id, pet);
  });

  primaryPets.forEach((pet) => {
    petMap.set(pet.id, pet);
  });

  return Array.from(petMap.values());
}

function deriveStatus(response: HomeResponse) {
  return response.pets.length === 0 &&
    response.todaySchedules.length === 0 &&
    response.overdueSchedules.length === 0 &&
    response.recentRecords.length === 0
    ? 'empty'
    : 'success';
}

export function HomeScreen({
  pets = [],
  initialSelectedPetId,
  refreshToken = 0,
  onOpenPets,
  onCreatePet,
}: HomeScreenProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading');
  const [selectedPetId, setSelectedPetId] = useState<string | undefined>(
    initialSelectedPetId ?? pets[0]?.id,
  );
  const [homeData, setHomeData] = useState<HomeResponse>({
    selectedPet: null,
    pets,
    todaySchedules: [],
    overdueSchedules: [],
    recentRecords: [],
  });

  useEffect(() => {
    setSelectedPetId((current) => {
      const availablePets = homeData.pets.length > 0 ? homeData.pets : pets;

      if (current && availablePets.some((pet) => pet.id === current)) {
        return current;
      }

      return initialSelectedPetId ?? homeData.selectedPet?.id ?? availablePets[0]?.id;
    });
  }, [homeData.pets, homeData.selectedPet?.id, initialSelectedPetId, pets]);

  useEffect(() => {
    let cancelled = false;

    async function loadHome() {
      setStatus('loading');

      try {
        const response = await fetchHome({ petId: selectedPetId });
        const mergedPets = mergePets(response.pets, pets);
        const fallbackSelectedPet =
          response.selectedPet ??
          mergedPets.find((pet) => pet.id === selectedPetId) ??
          mergedPets[0] ??
          null;
        const mergedResponse: HomeResponse = {
          ...response,
          pets: mergedPets,
          selectedPet: fallbackSelectedPet,
        };

        if (cancelled) {
          return;
        }

        setHomeData(mergedResponse);
        setStatus(deriveStatus(mergedResponse));
      } catch (_error) {
        if (cancelled) {
          return;
        }

        if (pets.length > 0) {
          setHomeData((current) => ({
            ...current,
            pets: mergePets(current.pets, pets),
            selectedPet:
              current.selectedPet ??
              pets.find((pet) => pet.id === selectedPetId) ??
              pets[0] ??
              null,
          }));
          setStatus('success');
          return;
        }

        setStatus('error');
      }
    }

    void loadHome();

    return () => {
      cancelled = true;
    };
  }, [pets, refreshToken, selectedPetId]);

  const selectedPet = useMemo(
    () =>
      homeData.selectedPet?.id === selectedPetId
        ? homeData.selectedPet
        : homeData.pets.find((pet) => pet.id === selectedPetId) ?? homeData.selectedPet,
    [homeData.pets, homeData.selectedPet, selectedPetId],
  );
  const orderedPets = useMemo(
    () => orderPetsForDisplay(homeData.pets, selectedPetId),
    [homeData.pets, selectedPetId],
  );

  function renderScheduleItem(schedule: Schedule) {
    return (
      <View key={schedule.id} style={styles.listCard}>
        <Text style={styles.listTitle}>{schedule.title}</Text>
        <Text style={styles.listMeta}>
          {schedule.type} · {schedule.dueAt}
        </Text>
      </View>
    );
  }

  function renderRecordItem(record: RecordItem) {
    return (
      <View key={record.id} style={styles.listCard}>
        <Text style={styles.listTitle}>{record.title}</Text>
        <Text style={styles.listMeta}>
          {record.type} · {record.occurredAt}
        </Text>
      </View>
    );
  }

  async function handleRefresh() {
    setStatus('loading');

    try {
      const response = await fetchHome({ petId: selectedPetId });
      const mergedResponse: HomeResponse = {
        ...response,
        pets: mergePets(response.pets, pets),
        selectedPet:
          response.selectedPet ??
          mergePets(response.pets, pets).find((pet) => pet.id === selectedPetId) ??
          mergePets(response.pets, pets)[0] ??
          null,
      };
      setHomeData(mergedResponse);
      setStatus(deriveStatus(mergedResponse));
    } catch (_error) {
      if (pets.length > 0) {
        setHomeData((current) => ({
          ...current,
          pets: mergePets(current.pets, pets),
          selectedPet:
            current.selectedPet ??
            pets.find((pet) => pet.id === selectedPetId) ??
            pets[0] ??
            null,
        }));
        setStatus('success');
        return;
      }

      setStatus('error');
    }
  }

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <View style={styles.header}>
          <SectionHeader
            eyebrow="오늘의 돌봄"
            title="지금 확인하면 좋은 반려동물 상태"
          />
          <View style={styles.headerActions}>
            {onOpenPets ? (
              <Pressable onPress={onOpenPets} style={styles.secondaryActionButton}>
                <Text style={styles.secondaryActionButtonText}>반려동물 관리</Text>
              </Pressable>
            ) : null}
            <Pressable onPress={() => void handleRefresh()} style={styles.refreshButton}>
              <Text style={styles.refreshButtonText}>다시 불러오기</Text>
            </Pressable>
          </View>
        </View>
        {status === 'loading' ? (
          <LoadingState
            title="홈 정보를 불러오는 중"
            description="오늘 해야 할 일정과 최근 기록을 정리하고 있어요."
            blocks={4}
          />
        ) : null}
        {status === 'error' ? (
          <ErrorState
            title="홈 정보를 불러오지 못했어요"
            description="잠시 후 다시 시도해 주세요."
            actionLabel="다시 불러오기"
            onAction={() => void handleRefresh()}
          />
        ) : null}

        {status !== 'loading' && status !== 'error' ? (
          <>
            <PetSummaryCard
              pet={selectedPet}
              subtitle={
                selectedPet
                  ? `${homeData.todaySchedules.length}개의 오늘 일정과 ${homeData.recentRecords.length}개의 최근 기록이 있어요`
                  : undefined
              }
            />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>반려동물 전환</Text>
              <PetSwitcherSheet
                pets={orderedPets}
                selectedPetId={selectedPetId}
                onSelectPet={setSelectedPetId}
                onAddPet={onCreatePet}
              />
            </View>

            {status === 'empty' ? (
              <EmptyState
                title="아직 오늘 보여줄 정보가 없어요"
                description="반려동물을 등록하거나 첫 일정과 기록을 추가하면 이 화면이 채워집니다."
                actionLabel="첫 반려동물 등록"
                onAction={onCreatePet}
              />
            ) : (
              <>
                <DashboardSummaryCard
                  title="오늘 돌봄 요약"
                  highlight={`오늘 일정 ${homeData.todaySchedules.length}건`}
                  description={
                    homeData.todaySchedules.length > 0
                      ? '오늘 해야 할 행동을 먼저 확인하고 바로 완료할 수 있어요.'
                      : '오늘 예정된 일정은 없어요. 여유가 있을 때 새로운 일정을 추가해 보세요.'
                  }
                />

                <ScheduleAlertCard count={homeData.overdueSchedules.length} />

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>오늘 일정</Text>
                  {homeData.todaySchedules.length > 0 ? (
                    homeData.todaySchedules.map(renderScheduleItem)
                  ) : (
                    <EmptyState
                      title="오늘 일정이 없어요"
                      description="새 일정을 추가하면 오늘 해야 할 일을 여기에서 바로 확인할 수 있어요."
                    />
                  )}
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>최근 기록</Text>
                  {homeData.recentRecords.length > 0 ? (
                    homeData.recentRecords.slice(0, 3).map(renderRecordItem)
                  ) : (
                    <EmptyState
                      title="최근 기록이 없어요"
                      description="체중, 메모, 병원 방문 기록을 남기면 최근 상태를 빠르게 확인할 수 있어요."
                    />
                  )}
                </View>
              </>
            )}
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  container: {
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  secondaryActionButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.default,
  },
  secondaryActionButtonText: {
    color: colors.text.primary,
    ...typography.label.medium,
  },
  refreshButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surface.subtle,
  },
  refreshButtonText: {
    color: colors.text.primary,
    ...typography.label.medium,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.text.primary,
    ...typography.title.medium,
  },
  listCard: {
    gap: spacing.xxs,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.default,
  },
  listTitle: {
    color: colors.text.primary,
    ...typography.label.large,
  },
  listMeta: {
    color: colors.text.secondary,
    ...typography.body.small,
  },
});
