import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { InlineMessage } from '../../components/feedback/inline-message';
import { TextField } from '../../components/forms/text-field';
import { useAuth } from '../../features/auth/use-auth';
import { colors, radius, spacing, typography } from '../../theme';

export function SignupScreen() {
  const {
    signup,
    resendVerification,
    isSubmitting,
    submitError,
    hasEmailDeliveryFailure,
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit() {
    if (!email || !password) {
      return;
    }

    const response = await signup(email, password);
    if (!response) {
      return;
    }
    setPendingEmail(response.email);
    setSuccessMessage('Verification email sent. Check your inbox before logging in.');
  }

  async function handleResendVerification() {
    if (!pendingEmail) {
      return;
    }

    const response = await resendVerification(pendingEmail);
    if (response) {
      setSuccessMessage('Verification email sent again.');
    }
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

      {successMessage ? <InlineMessage tone="success" message={successMessage} /> : null}
      {submitError ? <InlineMessage tone="error" message={submitError} /> : null}
      {hasEmailDeliveryFailure(submitError) ? (
        <InlineMessage
          tone="info"
          message="개발 환경에서는 SMTP 설정이 없으면 회원가입이 완료되지 않아요. 서버의 mail 환경 변수를 먼저 확인해 주세요."
        />
      ) : null}

      <Pressable
        onPress={() => void handleSubmit()}
        disabled={isSubmitting || !email || !password}
        style={[
          styles.primaryButton,
          isSubmitting || !email || !password ? styles.primaryButtonDisabled : null,
        ]}
      >
        <Text style={styles.primaryButtonText}>
          {isSubmitting ? '가입 중...' : '계정 만들기'}
        </Text>
      </Pressable>

      {pendingEmail ? (
        <View style={styles.pendingPanel}>
          <Text style={styles.pendingTitle}>이제 이메일 인증만 남았어요</Text>
          <Text style={styles.pendingDescription}>
            {pendingEmail}로 인증 메일을 보냈습니다. 메일을 확인한 뒤 로그인해 주세요.
          </Text>
          <Pressable
            onPress={() => void handleResendVerification()}
            disabled={isSubmitting}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>
              {isSubmitting ? '메일 전송 중...' : '인증 메일 다시 보내기'}
            </Text>
          </Pressable>
        </View>
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
  pendingPanel: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#CFE8D7',
    backgroundColor: '#EEF8F1',
  },
  pendingTitle: {
    color: colors.text.primary,
    ...typography.title.medium,
  },
  pendingDescription: {
    color: colors.text.secondary,
    ...typography.body.medium,
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
