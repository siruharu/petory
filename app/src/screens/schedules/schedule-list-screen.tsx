import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SectionHeader } from '../../components/common/section-header';
import { ScreenContainer } from '../../components/common/screen-container';
import { ScheduleCard } from '../../components/cards/schedule-card';
import { EmptyState } from '../../components/feedback/empty-state';
import { ErrorState } from '../../components/feedback/error-state';
import { LoadingState } from '../../components/feedback/loading-state';
import { completeSchedule, fetchSchedules } from '../../features/schedules/schedule-api';
import type { Schedule } from '../../types/domain';
import { spacing } from '../../theme';

interface ScheduleListScreenProps {
  selectedPetId?: string;
}

export function ScheduleListScreen({ selectedPetId }: ScheduleListScreenProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [completingScheduleId, setCompletingScheduleId] = useState<string | null>(null);

  async function loadSchedules(cancelled = false) {
    setStatus('loading');

    try {
      const response = await fetchSchedules(selectedPetId);

      if (cancelled) {
        return;
      }

      setSchedules(response);
      setStatus(response.length > 0 ? 'success' : 'empty');
    } catch (_error) {
      if (cancelled) {
        return;
      }

      setSchedules([]);
      setStatus('error');
    }
  }

  useEffect(() => {
    let cancelled = false;
    void loadSchedules(cancelled);

    return () => {
      cancelled = true;
    };
  }, [selectedPetId]);

  async function handleCompleteSchedule(scheduleId: string) {
    setCompletingScheduleId(scheduleId);

    try {
      await completeSchedule(scheduleId, {
        completedAt: new Date().toISOString(),
        createRecord: true,
      });
      await loadSchedules();
    } catch (_error) {
      setStatus('error');
    } finally {
      setCompletingScheduleId(null);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <SectionHeader
          eyebrow="일정"
          title="오늘 해야 할 돌봄 일정을 실행해요"
          description="예정된 할 일과 완료 가능한 일정만 명확하게 보여줍니다."
        />

        {status === 'loading' ? (
          <LoadingState
            title="일정을 불러오는 중"
            description="다가오는 일정과 완료 상태를 정리하고 있어요."
            blocks={3}
          />
        ) : null}
        {status === 'error' ? (
          <ErrorState
            title="일정을 불러오지 못했어요"
            description="잠시 후 다시 시도해 주세요."
            actionLabel="다시 시도"
            onAction={() => void loadSchedules()}
          />
        ) : null}
        {status === 'empty' ? (
          <EmptyState
            title="아직 등록된 일정이 없어요"
            description="예방접종, 약 복용, 산책 같은 일정을 추가하면 여기에서 바로 관리할 수 있어요."
          />
        ) : null}
        {status === 'success' ? schedules.map((schedule) => (
          <ScheduleCard
            key={schedule.id}
            schedule={schedule}
            isCompleting={completingScheduleId === schedule.id}
            onComplete={handleCompleteSchedule}
          />
        )) : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
});
