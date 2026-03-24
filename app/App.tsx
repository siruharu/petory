import React from 'react';
import { RootNavigator } from './src/app/navigation/root-navigator';
import { AuthProvider } from './src/app/providers/auth-provider';

function AppRoot() {
  return <RootNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoot />
    </AuthProvider>
  );
}
