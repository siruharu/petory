import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../components/common/screen-container';
import { SectionHeader } from '../../components/common/section-header';
import { InlineMessage } from '../../components/feedback/inline-message';
import { FormSection } from '../../components/forms/form-section';
import { TextField } from '../../components/forms/text-field';
import { useAuth } from '../../features/auth/use-auth';
import { colors, radius, spacing, typography } from '../../theme';

interface VerifyEmailScreenProps {
  initialToken?: string | null;
  onNavigateToLogin?: () => void;
  embedded?: boolean;
}

export function VerifyEmailScreen({
  initialToken = null,
  onNavigateToLogin,
  embedded = false,
}: VerifyEmailScreenProps) {
  const { verifyEmail, resendVerification, isSubmitting, submitError } = useAuth();
  const [token, setToken] = useState(initialToken ?? '');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [autoVerifyStatus, setAutoVerifyStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >(initialToken ? 'loading' : 'idle');
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    setToken(initialToken ?? '');
    setAutoVerifyStatus(initialToken ? 'loading' : 'idle');
    autoSubmittedRef.current = false;
  }, [initialToken]);

  useEffect(() => {
    if (!initialToken || autoSubmittedRef.current) {
      return;
    }

    autoSubmittedRef.current = true;
    const tokenToVerify = initialToken;

    async function autoVerify() {
      const response = await verifyEmail(tokenToVerify);

      if (response) {
        setMessage(`${response.email} 인증이 완료되었어요. 이제 로그인할 수 있습니다.`);
        setAutoVerifyStatus('success');
        return;
      }

      setAutoVerifyStatus('error');
    }

    void autoVerify();
  }, [initialToken, verifyEmail]);

  async function handleVerifyEmail() {
    if (!token) {
      return;
    }

    const response = await verifyEmail(token);
    if (response) {
      setMessage(`${response.email} 인증이 완료되었어요. 이제 로그인할 수 있습니다.`);
      setAutoVerifyStatus('success');
    }
  }

  async function handleResendVerification() {
    if (!email) {
      return;
    }

    const response = await resendVerification(email);
    if (response) {
      setMessage('인증 메일을 다시 보냈어요. 새 메일의 링크를 열어 주세요.');
    }
  }

  const content = (
    <View style={styles.container}>
      <SectionHeader
        eyebrow="이메일 인증"
        title="메일 링크로 인증을 마무리해 주세요"
        description="웹에서는 메일 링크로 자동 인증을 시도할 수 있지만, 모바일 앱에서는 링크가 자동으로 연결되지 않을 수 있습니다. 이 경우 아래 토큰 직접 입력을 사용합니다."
      />
        <InlineMessage
          tone="info"
          message="현재 모바일 앱은 deep link 자동 인증을 지원하지 않습니다. 메일 링크를 웹에서 열어 인증하거나, 메일에 포함된 토큰을 아래에 붙여 넣어 진행해 주세요."
        />

        {initialToken ? (
          <FormSection
            title="자동 인증 진행 상태"
            description="링크에 포함된 토큰으로 인증을 진행하고 있습니다."
          >
            {autoVerifyStatus === 'loading' ? (
              <InlineMessage
                tone="info"
                message="인증 링크를 확인하고 있어요. 잠시만 기다려 주세요."
              />
            ) : null}
            {autoVerifyStatus === 'success' ? (
              <InlineMessage
                tone="success"
                message="이메일 인증이 완료되었어요. 이제 로그인할 수 있습니다."
              />
            ) : null}
            {autoVerifyStatus === 'error' ? (
              <InlineMessage
                tone="error"
                message="링크 인증을 완료하지 못했어요. 아래 수동 인증이나 메일 재전송을 이용해 주세요."
              />
            ) : null}
            {autoVerifyStatus === 'success' && onNavigateToLogin ? (
              <Pressable onPress={onNavigateToLogin} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>로그인으로 이동</Text>
              </Pressable>
            ) : null}
          </FormSection>
        ) : null}

        {autoVerifyStatus !== 'success' ? (
          <FormSection
            title="토큰으로 직접 인증"
            description="메일의 링크를 열기 어렵거나 자동 인증이 실패했다면 인증 토큰을 붙여 넣어 진행할 수 있습니다."
          >
            <TextField
              label="인증 토큰"
              placeholder="메일에서 받은 인증 토큰을 붙여 넣어 주세요"
              autoCapitalize="none"
              value={token}
              onChangeText={setToken}
            />
            <Pressable
              onPress={() => void handleVerifyEmail()}
              disabled={isSubmitting || !token}
              style={[
                styles.primaryButton,
                isSubmitting || !token ? styles.primaryButtonDisabled : null,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {isSubmitting ? '인증 중...' : '이메일 인증 완료'}
              </Text>
            </Pressable>
          </FormSection>
        ) : null}

        <FormSection
          title="메일이 오지 않았나요?"
          description="인증 링크가 만료되었거나 메일을 다시 받고 싶다면 이메일 주소를 입력해 새 링크를 받으세요."
        >
          <TextField
            label="이메일"
            placeholder="name@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Pressable
            onPress={() => void handleResendVerification()}
            disabled={isSubmitting || !email}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>
              {isSubmitting ? '메일 전송 중...' : '인증 메일 다시 보내기'}
            </Text>
          </Pressable>
        </FormSection>

        {message ? <InlineMessage tone="success" message={message} /> : null}
        {submitError ? <InlineMessage tone="error" message={submitError} /> : null}
      {autoVerifyStatus === 'success' && onNavigateToLogin ? (
        <Pressable onPress={onNavigateToLogin} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>로그인 화면으로 돌아가기</Text>
        </Pressable>
      ) : null}
    </View>
  );

  if (embedded) {
    return content;
  }

  return <ScreenContainer>{content}</ScreenContainer>;
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    paddingVertical: spacing.md,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    borderRadius: radius.md,
    backgroundColor: colors.brand.primary,
    paddingHorizontal: spacing.md,
  },
  primaryButtonDisabled: {
    opacity: 0.45,
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
    backgroundColor: colors.surface.elevated,
    paddingHorizontal: spacing.md,
  },
  secondaryButtonText: {
    color: colors.text.primary,
    ...typography.label.large,
  },
});
