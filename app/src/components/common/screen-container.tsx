import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export function ScreenContainer({
  children,
  scrollable = false,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const verticalPadding = {
    paddingTop: insets.top + spacing.md,
    paddingBottom: insets.bottom + spacing.lg,
  };

  if (scrollable) {
    return (
      <View style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, verticalPadding]}
          style={styles.scrollView}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <View style={[styles.content, verticalPadding]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    gap: spacing.lg,
  },
});
