import React, { useEffect, useMemo, useState } from 'react';
import { Alert, BackHandler, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuthContext } from '../providers/auth-provider';
import { ScreenContainer } from '../../components/common/screen-container';
import { SectionHeader } from '../../components/common/section-header';
import { ErrorState } from '../../components/feedback/error-state';
import { LoadingState } from '../../components/feedback/loading-state';
import { LoginScreen } from '../../screens/auth/login-screen';
import { SignupScreen } from '../../screens/auth/signup-screen';
import { VerifyEmailScreen } from '../../screens/auth/verify-email-screen';
import { HomeScreen } from '../../screens/home/home-screen';
import { SettingsScreen } from '../../screens/settings/settings-screen';
import { PetListScreen } from '../../screens/pets/pet-list-screen';
import { PetFormScreen } from '../../screens/pets/pet-form-screen';
import { ScheduleListScreen } from '../../screens/schedules/schedule-list-screen';
import { ScheduleFormScreen } from '../../screens/schedules/schedule-form-screen';
import { fetchPets } from '../../features/pets/pet-api';
import type { Pet, Schedule } from '../../types/domain';
import { colors, radius, spacing, typography } from '../../theme';

type BrowserLocationLike = {
  pathname: string;
  search: string;
};

type BrowserHistoryLike = {
  replaceState: (data: unknown, unused: string, url?: string | URL | null) => void;
};

function getBrowserLocation(): BrowserLocationLike | null {
  const browserGlobal = globalThis as typeof globalThis & {
    location?: BrowserLocationLike;
  };

  return browserGlobal.location ?? null;
}

function getBrowserHistory(): BrowserHistoryLike | null {
  const browserGlobal = globalThis as typeof globalThis & {
    history?: BrowserHistoryLike;
  };

  return browserGlobal.history ?? null;
}

function readVerifyTokenFromLocation(): string | null {
  const location = getBrowserLocation();
  if (!location) {
    return null;
  }

  const { pathname, search } = location;
  if (!pathname.startsWith('/verify-email')) {
    return null;
  }

  const token = new URLSearchParams(search).get('token');
  return token?.trim() || null;
}

function replaceLocationToLogin() {
  const history = getBrowserHistory();
  if (!history) {
    return;
  }

  history.replaceState({}, '', '/');
}

function AuthState() {
  const initialVerifyToken = useMemo(() => readVerifyTokenFromLocation(), []);
  const [route, setRoute] = useState<'login' | 'signup' | 'verify'>(
    initialVerifyToken ? 'verify' : 'login',
  );
  const [verifyToken, setVerifyToken] = useState<string | null>(initialVerifyToken);

  function moveToLogin() {
    replaceLocationToLogin();
    setVerifyToken(null);
    setRoute('login');
  }

  return (
    <ScreenContainer>
      <View style={styles.authShell}>
        <SectionHeader
          eyebrow="Petory"
          title={
            route === 'verify'
              ? '이메일 인증을 마무리합니다'
              : '반려동물 돌봄을 매일 더 가볍게'
          }
          description={
            route === 'verify'
              ? '메일 링크의 토큰을 확인해 자동 인증을 시도합니다.'
              : '오늘 일정과 기록을 한 화면에서 확인하고, 필요한 행동만 바로 끝낼 수 있도록 정리합니다.'
          }
        />
        {route === 'verify' ? null : (
          <View style={styles.segmentedControl}>
            <Pressable
              onPress={() => setRoute('login')}
              style={[styles.segmentButton, route === 'login' ? styles.segmentButtonActive : null]}
            >
              <Text style={[styles.segmentText, route === 'login' ? styles.segmentTextActive : null]}>
                로그인
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setRoute('signup')}
              style={[styles.segmentButton, route === 'signup' ? styles.segmentButtonActive : null]}
            >
              <Text style={[styles.segmentText, route === 'signup' ? styles.segmentTextActive : null]}>
                회원가입
              </Text>
            </Pressable>
          </View>
        )}
        {route === 'login' ? <LoginScreen /> : null}
        {route === 'signup' ? <SignupScreen /> : null}
        {route === 'verify' ? (
          <VerifyEmailScreen
            initialToken={verifyToken}
            onNavigateToLogin={moveToLogin}
            embedded
          />
        ) : null}
      </View>
    </ScreenContainer>
  );
}

function AppState() {
  type BaseRoute = 'home' | 'pets' | 'schedules' | 'settings';
  type ChildRoute = 'pet-create' | 'schedule-create';
  type AppRoute = BaseRoute | ChildRoute;

  const [routeStack, setRouteStack] = useState<AppRoute[]>(['home']);
  const [cachedPets, setCachedPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | undefined>(undefined);
  const [homeRefreshToken, setHomeRefreshToken] = useState(0);
  const [scheduleRefreshToken, setScheduleRefreshToken] = useState(0);
  const [petBootstrapStatus, setPetBootstrapStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const route = routeStack[routeStack.length - 1] ?? 'home';

  function openBaseRoute(nextRoute: BaseRoute) {
    setRouteStack([nextRoute]);
  }

  function openChildRoute(nextRoute: ChildRoute) {
    setRouteStack((current) => {
      const currentRoute = current[current.length - 1];
      return currentRoute === nextRoute ? current : [...current, nextRoute];
    });
  }

  function navigateBack() {
    setRouteStack((current) => {
      if (current.length <= 1) {
        return current;
      }

      return current.slice(0, -1);
    });
  }

  function mergePets(currentPets: Pet[], incomingPets: Pet[]) {
    const petById = new Map<string, Pet>();

    incomingPets.forEach((pet) => {
      petById.set(pet.id, pet);
    });

    currentPets.forEach((pet) => {
      if (!petById.has(pet.id)) {
        petById.set(pet.id, pet);
      }
    });

    return Array.from(petById.values());
  }

  function upsertPet(nextPet: Pet) {
    setCachedPets((current) => {
      const withoutNextPet = current.filter((pet) => pet.id !== nextPet.id);
      return [...withoutNextPet, nextPet];
    });
  }

  function handlePetCreateSuccess(nextPet: Pet) {
    upsertPet(nextPet);
    setSelectedPetId(nextPet.id);
    setHomeRefreshToken((current) => current + 1);
    setRouteStack(['home']);
  }

  function handleScheduleCreateSuccess(_schedule: Schedule) {
    setHomeRefreshToken((current) => current + 1);
    setScheduleRefreshToken((current) => current + 1);
    setRouteStack(['schedules']);
  }

  function handleScheduleCompleted() {
    setHomeRefreshToken((current) => current + 1);
    setScheduleRefreshToken((current) => current + 1);
  }

  useEffect(() => {
    let cancelled = false;

    async function bootstrapPets() {
      setPetBootstrapStatus('loading');

      try {
        const initialPets = await fetchPets();
        if (cancelled) {
          return;
        }

        setCachedPets((current) => mergePets(current, initialPets));
        setSelectedPetId((current) => current ?? initialPets[0]?.id);
        setPetBootstrapStatus('success');
      } catch (_error) {
        if (cancelled) {
          return;
        }

        setPetBootstrapStatus('error');
      }
    }

    void bootstrapPets();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (routeStack.length > 1) {
        navigateBack();
        return true;
      }

      if (route !== 'home') {
        openBaseRoute('home');
        return true;
      }

      Alert.alert('앱을 종료할까요?', 'Petory를 종료하시겠어요?', [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '종료',
          style: 'destructive',
          onPress: () => BackHandler.exitApp(),
        },
      ]);

      return true;
    });

    return () => {
      subscription.remove();
    };
  }, [route, routeStack.length]);

  return (
    <ScreenContainer>
      <View style={styles.appShell}>
        <View style={styles.appHeader}>
          <Text style={styles.appTitle}>Petory</Text>
          <View style={styles.segmentedControl}>
            <Pressable
              onPress={() => openBaseRoute('home')}
              style={[styles.segmentButton, route === 'home' ? styles.segmentButtonActive : null]}
            >
              <Text style={[styles.segmentText, route === 'home' ? styles.segmentTextActive : null]}>
                홈
              </Text>
            </Pressable>
            <Pressable
              onPress={() => openBaseRoute('pets')}
              style={[styles.segmentButton, route === 'pets' ? styles.segmentButtonActive : null]}
            >
              <Text style={[styles.segmentText, route === 'pets' ? styles.segmentTextActive : null]}>
                반려동물
              </Text>
            </Pressable>
            <Pressable
              onPress={() => openBaseRoute('schedules')}
              style={[styles.segmentButton, route === 'schedules' ? styles.segmentButtonActive : null]}
            >
              <Text style={[styles.segmentText, route === 'schedules' ? styles.segmentTextActive : null]}>
                일정
              </Text>
            </Pressable>
            <Pressable
              onPress={() => openBaseRoute('settings')}
              style={[styles.segmentButton, route === 'settings' ? styles.segmentButtonActive : null]}
            >
              <Text style={[styles.segmentText, route === 'settings' ? styles.segmentTextActive : null]}>
                설정
              </Text>
            </Pressable>
          </View>
        </View>
        {route === 'home' ? (
          <HomeScreen
            pets={cachedPets}
            initialSelectedPetId={selectedPetId}
            refreshToken={homeRefreshToken}
            isPetsBootstrapping={petBootstrapStatus === 'loading'}
            onSelectPet={setSelectedPetId}
            onOpenPets={() => openBaseRoute('pets')}
            onCreatePet={() => openChildRoute('pet-create')}
            onOpenSchedules={() => openBaseRoute('schedules')}
            onCreateSchedule={() => openChildRoute('schedule-create')}
          />
        ) : null}
        {route === 'pets' ? (
          <PetListScreen
            pets={cachedPets}
            selectedPetId={selectedPetId}
            refreshToken={homeRefreshToken}
            onCreatePet={() => openChildRoute('pet-create')}
            onBackHome={() => openBaseRoute('home')}
          />
        ) : null}
        {route === 'pet-create' ? (
          <PetFormScreen
            mode="create"
            onCancel={navigateBack}
            onSuccess={handlePetCreateSuccess}
          />
        ) : null}
        {route === 'schedules' ? (
          <ScheduleListScreen
            selectedPetId={selectedPetId}
            refreshToken={scheduleRefreshToken}
            onCreateSchedule={() => openChildRoute('schedule-create')}
            onBackHome={() => openBaseRoute('home')}
            onScheduleCompleted={handleScheduleCompleted}
          />
        ) : null}
        {route === 'schedule-create' ? (
          <ScheduleFormScreen
            selectedPetId={selectedPetId}
            selectedPetName={cachedPets.find((pet) => pet.id === selectedPetId)?.name}
            pets={cachedPets}
            onCancel={navigateBack}
            onSuccess={handleScheduleCreateSuccess}
          />
        ) : null}
        {route === 'settings' ? <SettingsScreen /> : null}
      </View>
    </ScreenContainer>
  );
}

export function RootNavigator() {
  const { user, status } = useAuthContext();

  if (status === 'loading') {
    return (
      <ScreenContainer>
        <LoadingState
          title="세션을 준비하고 있어요"
          description="저장된 로그인 상태를 확인하고 있습니다."
          blocks={2}
        />
      </ScreenContainer>
    );
  }

  if (status === 'error') {
    return (
      <ScreenContainer>
        <ErrorState
          title="로그인 상태를 복구하지 못했어요"
          description="다시 시도하거나 다시 로그인해 주세요."
        />
      </ScreenContainer>
    );
  }

  if (!user) {
    return <AuthState />;
  }

  return <AppState />;
}

const styles = StyleSheet.create({
  authShell: {
    gap: spacing.lg,
  },
  appShell: {
    flex: 1,
    gap: spacing.lg,
  },
  appHeader: {
    gap: spacing.sm,
  },
  appTitle: {
    color: colors.text.primary,
    ...typography.title.large,
  },
  segmentedControl: {
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surface.subtle,
    alignSelf: 'flex-start',
  },
  segmentButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  segmentButtonActive: {
    backgroundColor: colors.surface.elevated,
  },
  segmentText: {
    color: colors.text.secondary,
    ...typography.label.medium,
  },
  segmentTextActive: {
    color: colors.text.primary,
  },
});
