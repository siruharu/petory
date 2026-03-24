import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../../components/feedback/empty-state';
import type { Pet } from '../../types/domain';
import { colors, radius, shadows, spacing, typography } from '../../theme';

interface PetSwitcherSheetProps {
  pets?: Pet[];
  selectedPetId?: string;
  onSelectPet?: (petId: string) => void;
  onAddPet?: () => void;
}

export function PetSwitcherSheet({
  pets = [],
  selectedPetId,
  onSelectPet,
  onAddPet,
}: PetSwitcherSheetProps) {
  const selectedPet = pets.find((pet) => pet.id === selectedPetId) ?? null;
  const otherPets = pets.filter((pet) => pet.id !== selectedPetId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>반려동물 전환</Text>

      {selectedPet ? (
        <View style={[styles.petRow, styles.selectedRow]}>
          <View style={styles.petRowContent}>
            <Text style={styles.petName}>{selectedPet.name}</Text>
            <Text style={styles.petMeta}>현재 선택됨 · {selectedPet.species}</Text>
            <Text style={styles.petPolicyHint}>현재 선택된 반려동물을 먼저 보여줘요.</Text>
          </View>
          <Text style={styles.selectedBadge}>선택됨</Text>
        </View>
      ) : null}

      {pets.length === 0 ? (
        <EmptyState
          title="등록된 반려동물이 없어요"
          description="새 반려동물을 등록하면 여기에서 바로 전환할 수 있어요."
        />
      ) : null}

      {otherPets.length > 0 ? (
        <View style={styles.group}>
          <Text style={styles.groupTitle}>다른 반려동물</Text>
          {otherPets.map((pet) => (
            <Pressable key={pet.id} onPress={() => onSelectPet?.(pet.id)} style={styles.petRow}>
              <View style={styles.petRowContent}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petMeta}>{pet.species}</Text>
              </View>
              <Text style={styles.switchLabel}>전환</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {onAddPet ? (
        <Pressable style={styles.addButton} onPress={onAddPet}>
          <Text style={styles.addButtonText}>새 반려동물 등록</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface.glass,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...shadows.card,
  },
  title: {
    color: colors.text.primary,
    ...typography.title.medium,
  },
  group: {
    gap: spacing.xs,
  },
  groupTitle: {
    color: colors.text.secondary,
    ...typography.label.medium,
  },
  petRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.elevated,
  },
  selectedRow: {
    backgroundColor: '#FFF6EF',
    borderColor: '#F6D7BE',
  },
  petRowContent: {
    flex: 1,
    gap: spacing.xxs,
  },
  petName: {
    color: colors.text.primary,
    ...typography.label.large,
  },
  petMeta: {
    color: colors.text.secondary,
    ...typography.body.small,
  },
  petPolicyHint: {
    color: colors.brand.primary,
    ...typography.body.small,
  },
  selectedBadge: {
    color: colors.brand.primary,
    ...typography.label.medium,
  },
  switchLabel: {
    color: colors.text.secondary,
    ...typography.label.medium,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: colors.text.primary,
    marginTop: spacing.xs,
  },
  addButtonText: {
    color: colors.text.inverse,
    ...typography.label.large,
  },
});
