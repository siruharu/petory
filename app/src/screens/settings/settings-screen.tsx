import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../features/auth/use-auth';
import { SectionHeader } from '../../components/common/section-header';
import { InlineMessage } from '../../components/feedback/inline-message';
import {
  clearPushNotifications,
  getStoredPushRegistration,
  syncPushNotifications,
} from '../../services/notifications/push-service';
import { getApiBaseUrl } from '../../services/api/client';
import { colors, radius, spacing, typography } from '../../theme';

export function SettingsScreen() {
  const { user, logout, isSubmitting } = useAuth();
  const [pushMessage, setPushMessage] = useState<string | null>(null);
  const [isSyncingPush, setIsSyncingPush] = useState(false);
  const apiBaseUrl = getApiBaseUrl();
  const isExpoGoLikely = !apiBaseUrl.includes('10.0.2.2');

  async function handleLogout() {
    try {
      await clearPushNotifications();
    } finally {
      await logout();
    }
  }

  async function handleSyncPushToken() {
    setIsSyncingPush(true);
    setPushMessage(null);

    try {
      if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
        setPushMessage('현재 런타임에서는 푸시 등록을 지원하지 않아요.');
        return;
      }

      const result = await syncPushNotifications(Platform.OS);

      if (result.permissionStatus !== 'granted') {
        setPushMessage(`Push permission status: ${result.permissionStatus}`);
        return;
      }

      if (!result.pushToken || !result.tokenId) {
        setPushMessage('Push token was not available');
        return;
      }

      setPushMessage(`Push token synced: ${result.tokenId}`);
    } catch (error) {
      setPushMessage(error instanceof Error ? error.message : 'Failed to sync push token');
    } finally {
      setIsSyncingPush(false);
    }
  }

  return (
    <View style={styles.container}>
      <SectionHeader
        eyebrow="설정"
        title="계정과 알림 상태를 정리해요"
      />

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>계정</Text>
        <Text style={styles.primaryValue}>{user ? user.email : '로그인 정보 없음'}</Text>
        <Text style={styles.secondaryValue}>
          {user?.emailVerified ? '이메일 인증 완료' : '이메일 인증 필요'}
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>실기기 연결</Text>
        <Text style={styles.secondaryValue}>
          현재 API 서버 주소를 확인하고, 안드로이드 실기기에서는 localhost 대신 개발 머신 LAN IP를 사용해야 합니다.
        </Text>
        <Text style={styles.debugLabel}>API_BASE_URL</Text>
        <Text style={styles.debugValue}>{apiBaseUrl}</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>알림</Text>
        <Text style={styles.secondaryValue}>
          {getStoredPushRegistration()
            ? '로그아웃 시 정리할 푸시 토큰이 저장되어 있어요'
            : '아직 저장된 푸시 토큰이 없어요'}
        </Text>
        {isExpoGoLikely ? (
          <InlineMessage
            tone="info"
            message="Expo Go 실기기 테스트에서는 푸시 알림이 제한되거나 동작하지 않을 수 있어요. 푸시 검증은 Android native build 또는 dev client 이후에 진행하는 것을 기준으로 합니다."
          />
        ) : null}
        <Pressable onPress={() => void handleSyncPushToken()} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>
            {isSyncingPush ? '알림 설정 중...' : '푸시 알림 활성화'}
          </Text>
        </Pressable>
      </View>

      {pushMessage ? <InlineMessage tone="info" message={pushMessage} /> : null}

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>세션</Text>
        <Text style={styles.secondaryValue}>
          현재 기기에서 로그인 상태를 종료합니다.
        </Text>
        <Pressable onPress={() => void handleLogout()} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>
            {isSubmitting ? '로그아웃 중...' : '로그아웃'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  sectionCard: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.default,
  },
  sectionTitle: {
    color: colors.text.primary,
    ...typography.title.medium,
  },
  primaryValue: {
    color: colors.text.primary,
    ...typography.body.large,
  },
  secondaryValue: {
    color: colors.text.secondary,
    ...typography.body.medium,
  },
  debugLabel: {
    color: colors.text.primary,
    ...typography.label.medium,
  },
  debugValue: {
    color: colors.text.secondary,
    ...typography.body.small,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    borderRadius: radius.md,
    backgroundColor: colors.text.primary,
    paddingHorizontal: spacing.md,
  },
  primaryButtonText: {
    color: colors.text.inverse,
    ...typography.label.large,
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.subtle,
    paddingHorizontal: spacing.md,
  },
  secondaryButtonText: {
    color: colors.text.primary,
    ...typography.label.large,
  },
});
