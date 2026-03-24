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
import { colors, radius, spacing, typography } from '../../theme';

export function SettingsScreen() {
  const { user, logout, isSubmitting } = useAuth();
  const [pushMessage, setPushMessage] = useState<string | null>(null);
  const [isSyncingPush, setIsSyncingPush] = useState(false);

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
        <Text style={styles.sectionTitle}>알림</Text>
        <Text style={styles.secondaryValue}>
          {getStoredPushRegistration()
            ? '로그아웃 시 정리할 푸시 토큰이 저장되어 있어요'
            : '아직 저장된 푸시 토큰이 없어요'}
        </Text>
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
