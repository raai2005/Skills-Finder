import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { Stack, router, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function EmailLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (!result.success) {
        Alert.alert('Login Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Login with Email',
          headerBackTitle: 'Back'
        }}
      />
      
      <Image 
        source={require('@/assets/images/icon.png')}
        resizeMode="contain"
        style={{width: 120, height: 120, marginBottom: 20}}
      />
      
      <ThemedText style={styles.title}>Contine with Email</ThemedText>
      
      <ThemedView style={styles.formContainer}>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: Colors[colorScheme ?? 'light'].border
            }
          ]}
          placeholder="Email"
          placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: Colors[colorScheme ?? 'light'].border
            }
          ]}
          placeholder="Password"
          placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity
          style={{
            width: '100%',
            height: 50,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 16,
            marginBottom: 16,
            backgroundColor: isLoading ? '#cccccc' : '#2196F3'
          }}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <ThemedText style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
            {isLoading ? 'Logging in...' : 'Login with Email'}
          </ThemedText>
        </TouchableOpacity>
        
        <ThemedView style={styles.bottomLinks}>
          <TouchableOpacity style={styles.linkButton} onPress={() => router.back()}>
            <ThemedText style={styles.linkText}>Back to Login Options</ThemedText>
          </TouchableOpacity>
          
          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity style={styles.linkButton}>
              <ThemedText style={styles.linkText}>Forgot Password?</ThemedText>
            </TouchableOpacity>
          </Link>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  bottomLinks: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkButton: {
    marginVertical: 8,
    padding: 4,
  },
  linkText: {
    fontSize: 16,
    color: '#2196F3',
  },
});
