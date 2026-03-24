import React from 'react';
import { FieldGroup } from './field-group';

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <FieldGroup title={title} description={description}>
      {children}
    </FieldGroup>
  );
}
