import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppNavigation } from '../modules/navigation';
import { useAuth } from '../modules/auth/context/AuthContext';

export default function AuthScreen() {
  const { user, logout } = useAuth();
  const { navigateTo } = useAppNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Статус аутентификации</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Статус:</Text>
          <Text style={styles.value}>{user ? 'Аутентифицирован' : 'Не аутентифицирован'}</Text>
        </View>
        
        {user && (
          <>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Имя пользователя:</Text>
              <Text style={styles.value}>{user.username || 'Не указано'}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={() => logout()}
            >
              <Text style={styles.buttonText}>Выйти</Text>
            </TouchableOpacity>
          </>
        )}
        
        {!user && (
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigateTo('LOGIN')}
          >
            <Text style={styles.buttonText}>Войти</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigateTo('HOME')}
        >
          <Text style={styles.buttonText}>На главную</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    width: 150,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  secondaryButton: {
    backgroundColor: '#3498db',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
