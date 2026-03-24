import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

interface TextFieldProps extends TextInputProps {
  label?: string;
  helperText?: string;
  errorMessage?: string | null;
  multiline?: boolean;
}

export function TextField({
  label,
  helperText,
  errorMessage,
  multiline = false,
  style,
  ...props
}: TextFieldProps) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor={colors.text.tertiary}
        style={[
          styles.input,
          multiline ? styles.multilineInput : null,
          errorMessage ? styles.errorInput : null,
          style,
        ]}
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      {!errorMessage && helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    color: colors.text.primary,
    ...typography.label.medium,
  },
  input: {
    minHeight: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: radius.md,
    backgroundColor: colors.surface.default,
    color: colors.text.primary,
    ...typography.body.large,
  },
  multilineInput: {
    minHeight: 112,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: colors.state.error,
    backgroundColor: '#FFF8F7',
  },
  helperText: {
    color: colors.text.secondary,
    ...typography.body.small,
  },
  errorText: {
    color: colors.state.error,
    ...typography.body.small,
  },
});
