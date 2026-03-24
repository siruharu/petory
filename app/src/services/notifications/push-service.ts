import { PermissionsAndroid, Platform } from 'react-native';
import { deleteNotificationToken, registerNotificationToken } from '../../features/notifications/notification-api';
import type { RegisterNotificationTokenResponse } from '../../types/api';

export type PushPermissionStatus = 'granted' | 'denied' | 'blocked';

export interface PushRegistrationResult {
  permissionStatus: PushPermissionStatus;
  pushToken: string | null;
}

export interface PushSyncResult {
  permissionStatus: PushPermissionStatus;
  pushToken: string | null;
  tokenId: string | null;
}

interface StoredPushRegistration {
  tokenId: string;
  pushToken: string;
  deviceType: 'ios' | 'android';
}

let storedPushRegistration: StoredPushRegistration | null = null;

function getMessagingModule(): any | null {
  try {
    const messagingPackage = require('@react-native-firebase/messaging');
    return messagingPackage.default;
  } catch {
    return null;
  }
}

export async function requestPushPermission(): Promise<PushPermissionStatus> {
  const messaging = getMessagingModule();
  if (!messaging) {
    return 'denied';
  }

  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const androidPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (androidPermission !== PermissionsAndroid.RESULTS.GRANTED) {
      return androidPermission === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
        ? 'blocked'
        : 'denied';
    }
  }

  const authorizationStatus = await messaging().requestPermission();

  if (
    authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
  ) {
    return 'granted';
  }

  if (authorizationStatus === messaging.AuthorizationStatus.DENIED) {
    return 'denied';
  }

  return 'blocked';
}

export async function getDevicePushToken(): Promise<string | null> {
  const messaging = getMessagingModule();
  if (!messaging) {
    return null;
  }

  await messaging().registerDeviceForRemoteMessages();
  return messaging().getToken();
}

export async function registerForPushNotifications(): Promise<PushRegistrationResult> {
  const permissionStatus = await requestPushPermission();
  if (permissionStatus !== 'granted') {
    return {
      permissionStatus,
      pushToken: null,
    };
  }

  const pushToken = await getDevicePushToken();
  return {
    permissionStatus,
    pushToken,
  };
}

export async function syncPushTokenToServer(
  deviceType: 'ios' | 'android',
  pushToken: string,
): Promise<RegisterNotificationTokenResponse> {
  return registerNotificationToken({
    deviceType,
    pushToken,
  });
}

export async function removePushTokenFromServer(tokenId: string): Promise<void> {
  await deleteNotificationToken(tokenId);
}

export function getStoredPushRegistration(): StoredPushRegistration | null {
  return storedPushRegistration;
}

export function clearStoredPushRegistration() {
  storedPushRegistration = null;
}

export async function syncPushNotifications(
  deviceType: 'ios' | 'android',
): Promise<PushSyncResult> {
  const registration = await registerForPushNotifications();

  if (registration.permissionStatus !== 'granted' || !registration.pushToken) {
    return {
      permissionStatus: registration.permissionStatus,
      pushToken: registration.pushToken,
      tokenId: null,
    };
  }

  const response = await syncPushTokenToServer(deviceType, registration.pushToken);
  storedPushRegistration = {
    tokenId: response.tokenId,
    pushToken: registration.pushToken,
    deviceType,
  };

  return {
    permissionStatus: registration.permissionStatus,
    pushToken: registration.pushToken,
    tokenId: response.tokenId,
  };
}

export async function clearPushNotifications() {
  if (!storedPushRegistration) {
    return;
  }

  try {
    await removePushTokenFromServer(storedPushRegistration.tokenId);
  } finally {
    clearStoredPushRegistration();
  }
}
