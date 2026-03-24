import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { InlineMessage } from '../../components/feedback/inline-message';
import { TextField } from '../../components/forms/text-field';
import { useAuth } from '../../features/auth/use-auth';
import { colors, radius, spacing, typography } from '../../theme';

export function LoginScreen() {
  const {
    login,
    resendVerification,
    isSubmitting,
    submitError,
    hasEmailDeliveryFailure,
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const isVerificationRequired = submitError?.toLowerCase().includes('verification') ?? false;

  async function handleSubmit() {
    if (!email || !password) {
      return;
    }

    setInfoMessage(null);
    await login(email, password);
  }

  async function handleResendVerification() {
    if (!email) {
      return;
    }

    await resendVerification(email);
    setInfoMessage('Verification email sent.');
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextField
          label="이메일"
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          label="비밀번호"
          placeholder="비밀번호를 입력해 주세요"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {submitError ? <InlineMessage tone="error" message={submitError} /> : null}
      {hasEmailDeliveryFailure(submitError) ? (
        <InlineMessage
          tone="info"
          message="메일 전송 설정 문제로 회원가입 단계가 막혔을 수 있어요. 서버의 SMTP 설정을 먼저 확인해 주세요."
        />
      ) : null}
      {isVerificationRequired ? (
        <InlineMessage
          tone="info"
          message="이메일 인증을 마치면 로그인할 수 있어요. 인증 메일을 다시 보낼 수 있습니다."
        />
      ) : null}
      {infoMessage ? <InlineMessage tone="success" message={infoMessage} /> : null}

      <Pressable
        onPress={() => void handleSubmit()}
        disabled={isSubmitting || !email || !password}
        style={[
          styles.primaryButton,
          isSubmitting || !email || !password ? styles.primaryButtonDisabled : null,
        ]}
      >
        <Text style={styles.primaryButtonText}>{isSubmitting ? '로그인 중...' : '로그인'}</Text>
      </Pressable>

      {isVerificationRequired ? (
        <Pressable
          onPress={() => void handleResendVerification()}
          disabled={isSubmitting || !email}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>
            {isSubmitting ? '메일 전송 중...' : '인증 메일 다시 보내기'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    paddingVertical: spacing.md,
  },
  form: {
    gap: spacing.md,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
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
    minHeight: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.default,
    paddingHorizontal: spacing.md,
  },
  secondaryButtonText: {
    color: colors.text.primary,
    ...typography.label.large,
  },
});
