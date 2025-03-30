import React from 'react';
import { useAuth } from '../../modules/auth/context/AuthContext';
import { HomePage } from '@/components';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <HomePage 
      isAuthorized={!!user} 
      isTabsLayout={true} 
      showHeader={true}
    />
  );
}
