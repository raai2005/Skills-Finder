import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);
  const colorScheme = useColorScheme();
  const { verifyResetToken, resetPassword } = useAuth();

  // Verify token when component mounts
  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        Alert.alert(
          'Invalid Link', 
          'The password reset link is invalid or has expired.',
          [
            {
              text: 'Go to Login',
              onPress: () => router.replace('/(auth)/login'),
            },
          ]
        );
        return;
      }

      try {
        const result = await verifyResetToken(token as string);
        setIsTokenValid(result.success);
        setTokenChecked(true);
        
        if (!result.success) {
          Alert.alert(
            'Invalid or Expired Link', 
            'The password reset link is invalid or has expired. Please request a new one.',
            [
              {
                text: 'Go to Login',
                onPress: () => router.replace('/(auth)/login'),
              },
            ]
          );
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setIsTokenValid(false);
        setTokenChecked(true);
        Alert.alert(
          'Error', 
          'There was a problem verifying your reset link. Please try again.',
          [
            {
              text: 'Go to Login',
              onPress: () => router.replace('/(auth)/login'),
            },
          ]
        );
      }
    };
    
    checkToken();
  }, [token]);

  const handleResetPassword = async () => {
    // Password validation
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please enter both password fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(token as string, password);
      
      if (result.success) {
        Alert.alert(
          'Password Reset Successful',
          'Your password has been reset successfully. You can now log in with your new password.',
          [
            {
              text: 'Go to Login',
              onPress: () => router.replace('/(auth)/login'),
            },
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Failed to reset password');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenChecked) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'Reset Password' }} />
        <ThemedText>Verifying your reset link...</ThemedText>
      </ThemedView>
    );
  }

  if (!isTokenValid) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'Reset Password' }} />
        <ThemedText style={styles.title}>Invalid Reset Link</ThemedText>
        <ThemedText style={styles.message}>
          The password reset link is invalid or has expired.
        </ThemedText>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/(auth)/forgot-password')}
        >
          <ThemedText style={styles.buttonText}>Request New Link</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Reset Password' }} />
      
      <ThemedText style={styles.title}>Create New Password</ThemedText>
      <ThemedText style={styles.message}>
        Please create a new password for your account.
      </ThemedText>
      
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
          placeholder="New Password"
          placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
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
          placeholder="Confirm Password"
          placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
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
            backgroundColor: isLoading ? '#cccccc' : '#2196F3'
          }}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          <ThemedText style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </ThemedText>
        </TouchableOpacity>
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
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
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
  button: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
