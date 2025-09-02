import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function AdminLoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const primaryColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(username, password);
      
      if (result.success) {
        Alert.alert('Success', result.message, [
          { 
            text: 'OK', 
            onPress: () => {
              router.push('/(tabs)/admin');
            }
          }
        ]);
      } else {
        Alert.alert('Login Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Admin Login',
        headerStyle: { 
          backgroundColor: Platform.OS === 'ios' ? backgroundColor : primaryColor 
        },
        headerTintColor: Platform.OS === 'ios' ? primaryColor : '#ffffff',
      }} />
      
      <KeyboardAvoidingView 
        style={[styles.container, { backgroundColor }]} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ThemedView style={styles.content}>
          <View style={styles.logoContainer}>
            <ThemedText style={styles.title}>SKILLS FINDER</ThemedText>
            <ThemedText style={styles.subtitle}>Admin Access</ThemedText>
            <View style={[styles.divider, { backgroundColor: primaryColor }]} />
          </View>
          
          <ThemedView style={styles.formContainer}>
            <View style={styles.formHeader}>
              <ThemedText style={styles.formTitle}>[ LOGIN ]</ThemedText>
            </View>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Username:</ThemedText>
              <TextInput
                style={[styles.input, { color: textColor, borderColor: primaryColor }]}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
                placeholderTextColor="#888"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Password:</ThemedText>
              <TextInput
                style={[styles.input, { color: textColor, borderColor: primaryColor }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor="#888"
                secureTextEntry
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: primaryColor }]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              <ThemedText style={styles.buttonText}>
                {isLoading ? 'LOGGING IN...' : 'LOGIN'}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 16,
    textAlign: 'center',
  },
  divider: {
    height: 2,
    width: '80%',
    marginBottom: 16,
  },
  formContainer: {
    borderWidth: 1,
    borderColor: '#00FF00',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  formHeader: {
    padding: 12,
    backgroundColor: '#000080',
    borderBottomWidth: 1,
    borderBottomColor: '#00FF00',
  },
  formTitle: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: 'bold',
    color: '#00FF00',
  },
  inputContainer: {
    padding: 16,
  },
  label: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  button: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    marginHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  }
});
