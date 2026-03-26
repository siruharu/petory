import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SectionHeader } from '../../components/common/section-header';
import { ScreenContainer } from '../../components/common/screen-container';
import { ScheduleCard } from '../../components/cards/schedule-card';
import { EmptyState } from '../../components/feedback/empty-state';
import { ErrorState } from '../../components/feedback/error-state';
import { InlineMessage } from '../../components/feedback/inline-message';
import { LoadingState } from '../../components/feedback/loading-state';
import { completeSchedule, fetchSchedules } from '../../features/schedules/schedule-api';
import type { Schedule } from '../../types/domain';
import { colors, radius, spacing, typography } from '../../theme';

interface ScheduleListScreenProps {
  selectedPetId?: string;
  refreshToken?: number;
  onCreateSchedule?: () => void;
  onBackHome?: () => void;
  onScheduleCompleted?: () => void;
}

export function ScheduleListScreen({
  selectedPetId,
  refreshToken = 0,
  onCreateSchedule,
  onBackHome,
  onScheduleCompleted,
}: ScheduleListScreenProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [completingScheduleId, setCompletingScheduleId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState<{ tone: 'info' | 'success' | 'error'; text: string } | null>(null);

  async function loadSchedules(options?: { cancelled?: boolean; background?: boolean }) {
    const cancelled = options?.cancelled ?? false;
    const background = options?.background ?? false;

    if (!selectedPetId) {
      setSchedules([]);
      setStatus('empty');
      return;
    }

    if (background && schedules.length > 0) {
      setIsRefreshing(true);
    } else {
      setStatus('loading');
    }

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

      if (schedules.length > 0) {
        setMessage({
          tone: 'error',
          text: '최신 일정을 가져오지 못해 현재 보고 있던 일정 목록을 유지했어요.',
        });
        setStatus('success');
        return;
      }

      setSchedules([]);
      setStatus('error');
    } finally {
      if (!cancelled) {
        setIsRefreshing(false);
      }
    }
  }

  useEffect(() => {
    let cancelled = false;
    void loadSchedules({ cancelled, background: false });

    return () => {
      cancelled = true;
    };
  }, [refreshToken, selectedPetId]);

  async function handleCompleteSchedule(scheduleId: string) {
    if (completingScheduleId) {
      return;
    }

    setCompletingScheduleId(scheduleId);
    setMessage(null);

    try {
      await completeSchedule(scheduleId, {
        completedAt: new Date().toISOString(),
        createRecord: true,
      });
      setMessage({
        tone: 'success',
        text: '일정을 완료했어요. 반복 일정이면 다음 일정도 함께 정리했어요.',
      });
      await loadSchedules({ background: true });
      onScheduleCompleted?.();
    } catch (_error) {
      setMessage({
        tone: 'error',
        text: '일정 완료 처리에 실패했어요. 잠시 후 다시 시도해 주세요.',
      });
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
        <View style={styles.actions}>
          {onBackHome ? (
            <Pressable style={styles.secondaryButton} onPress={onBackHome}>
              <Text style={styles.secondaryButtonText}>홈으로 돌아가기</Text>
            </Pressable>
          ) : null}
          {onCreateSchedule && selectedPetId ? (
            <Pressable style={styles.primaryButton} onPress={onCreateSchedule}>
              <Text style={styles.primaryButtonText}>새 일정 등록</Text>
            </Pressable>
          ) : null}
          {selectedPetId ? (
            <Pressable
              style={styles.secondaryButton}
              onPress={() => void loadSchedules({ background: true })}
            >
              <Text style={styles.secondaryButtonText}>
                {isRefreshing ? '불러오는 중...' : '다시 불러오기'}
              </Text>
            </Pressable>
          ) : null}
        </View>
        {message ? <InlineMessage tone={message.tone} message={message.text} /> : null}

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
            onAction={() => void loadSchedules({ background: false })}
          />
        ) : null}
        {status === 'empty' ? (
          <EmptyState
            title={selectedPetId ? '아직 등록된 일정이 없어요' : '먼저 반려동물을 선택해 주세요'}
            description={
              selectedPetId
                ? '예방접종, 약 복용, 산책 같은 일정을 추가하면 여기에서 바로 관리할 수 있어요.'
                : '일정을 만들려면 현재 확인할 반려동물을 먼저 정해야 해요.'
            }
            actionLabel={selectedPetId ? '첫 일정 등록' : onBackHome ? '홈으로 돌아가기' : undefined}
            onAction={selectedPetId ? onCreateSchedule : onBackHome}
          />
        ) : null}
        {status === 'success'
          ? schedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                isCompleting={completingScheduleId === schedule.id}
                onComplete={handleCompleteSchedule}
              />
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
});
