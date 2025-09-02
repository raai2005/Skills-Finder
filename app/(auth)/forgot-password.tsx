import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const colorScheme = useColorScheme();
  const { forgotPassword } = useAuth();

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        setSubmitted(true);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToLogin = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Forgot Password</ThemedText>
      
      {!submitted ? (
        <>
          <ThemedText style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password
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
              placeholder="Email"
              placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: isLoading ? '#cccccc' : Colors[colorScheme ?? 'light'].tint }
              ]}
              onPress={handleForgotPassword}
              disabled={isLoading}
            >
              <ThemedText style={styles.buttonText}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </>
      ) : (
        <ThemedView style={styles.successContainer}>
          <ThemedText style={styles.successText}>
            We've sent a password reset link to your email. Please check your inbox and follow the instructions.
          </ThemedText>
          
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint }
            ]}
            onPress={goToLogin}
          >
            <ThemedText style={styles.buttonText}>
              Return to Login
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ThemedText style={styles.backButtonText}>Back</ThemedText>
      </TouchableOpacity>
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
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
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
    width: '100%',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginTop: 30,
  },
  backButtonText: {
    fontSize: 16,
  },
});
