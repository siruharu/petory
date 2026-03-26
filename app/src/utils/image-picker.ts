import { Platform } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { pickWebImageAsDataUrl, type PickedImageFile } from './web-image-picker';

function buildNativeImageDataUrl(asset: ExpoImagePicker.ImagePickerAsset) {
  if (asset.uri.startsWith('data:')) {
    return asset.uri;
  }

  if (!asset.base64) {
    return asset.uri;
  }

  const mimeType = asset.mimeType?.trim() || 'image/jpeg';
  return `data:${mimeType};base64,${asset.base64}`;
}

async function pickNativeImageAsDataUrl(): Promise<PickedImageFile | null> {
  const permission = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error('사진 보관함 접근 권한이 필요해요. 권한을 허용한 뒤 다시 시도해 주세요.');
  }

  const result = await ExpoImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: false,
    quality: 0.8,
    base64: true,
    selectionLimit: 1,
  });

  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];
  if (!asset) {
    return null;
  }

  return {
    dataUrl: buildNativeImageDataUrl(asset),
    fileName: asset.fileName ?? 'pet-photo.jpg',
  };
}

export async function pickImageAsDataUrl(): Promise<PickedImageFile | null> {
  if (Platform.OS === 'web') {
    return pickWebImageAsDataUrl();
  }

  return pickNativeImageAsDataUrl();
}
