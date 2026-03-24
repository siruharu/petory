import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { Pet } from '../../types/domain';
import { colors, radius, shadows, spacing, typography } from '../../theme';

interface PetSummaryCardProps {
  pet: Pet | null;
  subtitle?: string;
}

export function PetSummaryCard({ pet, subtitle }: PetSummaryCardProps) {
  if (!pet) {
    return null;
  }

  const secondaryMeta = [pet.species, pet.ageText, pet.breed].filter(Boolean).join(' · ');

  return (
    <View style={styles.container}>
      {pet.photoUrl ? (
        <Image source={{ uri: pet.photoUrl }} style={styles.photo} resizeMode="cover" />
      ) : (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{pet.name.slice(0, 1).toUpperCase()}</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.eyebrow}>선택된 반려동물</Text>
        <Text style={styles.name}>{pet.name}</Text>
        {secondaryMeta ? <Text style={styles.meta}>{secondaryMeta}</Text> : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface.elevated,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...shadows.card,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDE2CF',
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.surface.subtle,
  },
  avatarText: {
    color: colors.brand.primary,
    ...typography.title.large,
  },
  content: {
    flex: 1,
    gap: spacing.xxs,
  },
  eyebrow: {
    color: colors.brand.primary,
    ...typography.label.medium,
  },
  name: {
    color: colors.text.primary,
    ...typography.title.large,
  },
  meta: {
    color: colors.text.secondary,
    ...typography.body.medium,
  },
  subtitle: {
    color: colors.text.primary,
    ...typography.body.medium,
  },
});
