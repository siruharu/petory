import { useState } from 'react';
import { useAuthContext } from '../../app/providers/auth-provider';
import { ApiError, apiRequest } from '../../services/api/client';
import { sessionStorage } from '../../services/storage/session-storage';
import type {
  AuthResponse,
  ResendVerificationResponse,
  SignupResponse,
  VerifyEmailResponse,
} from '../../types/api';

export function useAuth() {
  const { user, setUser, accessToken, setAccessToken, status } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function mapAuthError(error: unknown, fallback: string): string {
    if (error instanceof ApiError) {
      if (error.code === 'EMAIL_DELIVERY_FAILED') {
        return '인증 메일을 보내지 못했어요. 메일 설정을 확인하거나 잠시 후 다시 시도해 주세요.';
      }

      if (error.message === 'Invalid credentials') {
        return 'Email or password is incorrect';
      }

      if (error.message === 'Email verification is required') {
        return 'Email verification is required before login';
      }

      if (error.message === 'Email already exists') {
        return 'Email already exists';
      }

      return error.message;
    }

    return error instanceof Error ? error.message : fallback;
  }

  function hasEmailDeliveryFailure(errorMessage: string | null): boolean {
    return errorMessage?.includes('인증 메일을 보내지 못했어요') ?? false;
  }

  async function submitLogin(email: string, password: string) {
    const data = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setUser(data.user);
    setAccessToken(data.accessToken);
    await sessionStorage.setAccessToken(data.accessToken);

    return data;
  }

  async function submitSignup(email: string, password: string) {
    return apiRequest<SignupResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async function login(email: string, password: string) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      return await submitLogin(email, password);
    } catch (error) {
      setSubmitError(mapAuthError(error, 'Login failed'));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function signup(email: string, password: string) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      return await submitSignup(email, password);
    } catch (error) {
      setSubmitError(mapAuthError(error, 'Signup failed'));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyEmail(token: string) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      return await apiRequest<VerifyEmailResponse>('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
    } catch (error) {
      setSubmitError(mapAuthError(error, 'Email verification failed'));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resendVerification(email: string) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      return await apiRequest<ResendVerificationResponse>('/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      setSubmitError(mapAuthError(error, 'Failed to resend verification email'));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function logout() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await sessionStorage.clear();
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Logout failed');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    user,
    accessToken,
    status,
    isSubmitting,
    submitError,
    login,
    signup,
    verifyEmail,
    resendVerification,
    logout,
    hasEmailDeliveryFailure,
  };
}
