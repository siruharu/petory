import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SectionHeader } from '../../components/common/section-header';
import { ScreenContainer } from '../../components/common/screen-container';
import { RecordCard } from '../../components/cards/record-card';
import { EmptyState } from '../../components/feedback/empty-state';
import { ErrorState } from '../../components/feedback/error-state';
import { LoadingState } from '../../components/feedback/loading-state';
import { fetchRecords } from '../../features/records/record-api';
import type { RecordItem, RecordType } from '../../types/domain';
import { spacing } from '../../theme';

interface RecordListScreenProps {
  selectedPetId?: string;
  type?: RecordType;
  page?: number;
}

export function RecordListScreen({
  selectedPetId,
  type,
  page = 1,
}: RecordListScreenProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading');
  const [records, setRecords] = useState<RecordItem[]>([]);

  async function loadRecords(cancelled = false) {
    setStatus('loading');

    try {
      const response = await fetchRecords(selectedPetId, type, page);

      if (cancelled) {
        return;
      }

      setRecords(response);
      setStatus(response.length > 0 ? 'success' : 'empty');
    } catch (_error) {
      if (cancelled) {
        return;
      }

      setRecords([]);
      setStatus('error');
    }
  }

  useEffect(() => {
    let cancelled = false;
    void loadRecords(cancelled);

    return () => {
      cancelled = true;
    };
  }, [page, selectedPetId, type]);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <SectionHeader
          eyebrow="기록"
          title="반려동물의 최근 상태를 타임라인으로 확인해요"
          description="기록 목록에서는 최근 상태 파악과 오류 복구 동작만 우선 제공합니다."
        />

        {status === 'loading' ? (
          <LoadingState
            title="기록을 불러오는 중"
            description="최근 메모와 측정값을 정리하고 있어요."
            blocks={3}
          />
        ) : null}
        {status === 'error' ? (
          <ErrorState
            title="기록을 불러오지 못했어요"
            description="잠시 후 다시 시도해 주세요."
            actionLabel="다시 시도"
            onAction={() => void loadRecords()}
          />
        ) : null}
        {status === 'empty' ? (
          <EmptyState
            title="아직 기록이 없어요"
            description="체중, 메모, 병원 방문 기록을 남기면 최근 상태를 빠르게 확인할 수 있어요."
          />
        ) : null}
        {status === 'success'
          ? records.map((record) => <RecordCard key={record.id} record={record} />)
          : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
});
