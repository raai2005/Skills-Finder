import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SocialAuthButton } from '@/components/SocialAuthButton';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { firebaseConfigured } from '@/firebase';

export default function LoginScreen() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const colorScheme = useColorScheme();
  const { login, loginWithGithub, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!userId || !password) {
      Alert.alert('Error', 'Please enter both User ID and password');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(userId, password);
      
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

  const handleGithubLogin = async () => {
    try {
      const result = await loginWithGithub();
      if (!result.success) {
        Alert.alert('GitHub Login Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        Alert.alert('Google Login Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    }
  };
  
  const handleEmailLogin = async () => {
    if (!email || !emailPassword) {
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
      const result = await login(email, emailPassword);
      
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
      <Image 
        source={require('@/assets/images/icon.png')}
        resizeMode="contain"
        style={{width: 160, height: 160, marginBottom: 20}}
      />
      
      <ThemedText style={styles.title}>SkillsFinder</ThemedText>
      
      <ThemedView style={styles.formContainer}>
        {!showEmailLogin ? (
          <>
            {/* User ID Login Form */}
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].border
                }
              ]}
              placeholder="User ID"
              placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
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
                {isLoading ? 'Logging in...' : 'Login'}
              </ThemedText>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Email Login Form */}
            <ThemedText style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center'}}>
              Continue with Email
            </ThemedText>
            
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
              value={emailPassword}
              onChangeText={setEmailPassword}
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
                backgroundColor: isLoading ? '#cccccc' : '#1976D2'
              }}
              onPress={handleEmailLogin}
              disabled={isLoading}
            >
              <ThemedText style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                {isLoading ? 'Logging in...' : 'Login with Email'}
              </ThemedText>
            </TouchableOpacity>
            
            <ThemedView style={{marginTop: 10, alignItems: 'center'}}>
              <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity style={styles.linkButton}>
                  <ThemedText style={{color: '#1976D2', fontSize: 16}}>
                    Forgot Password?
                  </ThemedText>
                </TouchableOpacity>
              </Link>
              
              <TouchableOpacity
                style={{marginTop: 10, alignItems: 'center'}}
                onPress={() => setShowEmailLogin(false)}
              >
                <ThemedText style={{color: '#1976D2', fontSize: 16}}>
                  Back to Login Options
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </>
        )}
        
        {!showEmailLogin && (
          <>
            <ThemedView style={styles.divider}>
              <ThemedView style={styles.dividerLine} />
              <ThemedText style={styles.dividerText}>OR LOGIN WITH</ThemedText>
              <ThemedView style={styles.dividerLine} />
            </ThemedView>
            
            <TouchableOpacity
              style={{
                width: '100%',
                height: 50,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 8,
                backgroundColor: '#1976D2',
                flexDirection: 'row',
              }}
              onPress={() => setShowEmailLogin(true)}
            >
              <Ionicons name="mail" size={20} color="white" style={{marginRight: 8}} />
              <ThemedText style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                Continue with Email
              </ThemedText>
            </TouchableOpacity>
            
            {!firebaseConfigured && (
              <ThemedView style={{
                width: '100%',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#555',
                padding: 10,
                marginTop: 4,
                marginBottom: 8,
                backgroundColor: '#1f1f1f'
              }}>
                <ThemedText style={{ fontSize: 12, opacity: 0.85 }}>
                  Firebase is not configured. Social login will use demo mode until you set EXPO_PUBLIC_FIREBASE_* or app.json → expo.extra.firebase and restart.
                </ThemedText>
              </ThemedView>
            )}

            <SocialAuthButton 
              provider="github" 
              onPress={handleGithubLogin}
            />
            
            <SocialAuthButton 
              provider="google" 
              onPress={handleGoogleLogin}
            />
          </>
        )}
        
        <ThemedView style={styles.bottomLinks}>
          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity style={styles.linkButton}>
              <ThemedText style={styles.linkText}>Forgot Password?</ThemedText>
            </TouchableOpacity>
          </Link>
          
          <ThemedView style={styles.registerContainer}>
            <ThemedText>Don't have an account? </ThemedText>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <ThemedText style={styles.registerLink}>Register</ThemedText>
              </TouchableOpacity>
            </Link>
          </ThemedView>
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
  wave: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
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
  button: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    height: 50,
  },
  githubButton: {
    backgroundColor: '#24292e',
  },
  googleButton: {
    backgroundColor: '#EA4335',
  },
  socialButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  socialIcon: {
    marginRight: 8,
  },
  bottomLinks: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerLink: {
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#888888',
  },
});
