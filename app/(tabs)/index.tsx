import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { BotanicalGardenInfo } from '@/components/BotanicalGardenInfo';
import { SectorButtons } from '@/components/SectorButtons';
import { AuthButton } from '@/components/AuthButton';
import { UserGreeting } from '@/components/time-based-greeting';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <Header />
      
      {user ? (
        <>
          <UserGreeting showUserInfo={true} />
          <SectorButtons />
        </>
      ) : (
        <>
          <BotanicalGardenInfo />
          <AuthButton />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
