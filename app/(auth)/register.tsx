import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Link, router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const validateForm = () => {
    // Simple validation
    if (!formData.firstName.trim()) {
      Alert.alert('Error', 'First name is required');
      return false;
    }
    
    if (!formData.lastName.trim()) {
      Alert.alert('Error', 'Last name is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return false;
    }
    
    // Simple email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }
    
    if (!formData.password) {
      Alert.alert('Error', 'Password is required');
      return false;
    }
    
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    
    return true;
  };
  
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await register({
        name: formData.firstName + ' ' + formData.lastName,
        email: formData.email,
        password: formData.password,
        skills: [], // Empty array for skills
        tools: []   // Empty array for tools
      });
      
      if (result.success) {
        // Registration successful, navigate to the next screen
        // This happens automatically due to the isAuthenticated state change
      } else {
        Alert.alert('Error', result.message || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Create Account</ThemedText>
        <ThemedText style={styles.subtitle}>
          Sign up to discover hackathons, join teams, and borrow tools
        </ThemedText>
        
        <ThemedView style={styles.formContainer}>
          <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
          
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].border
              }
            ]}
            placeholder="First Name"
            placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
            value={formData.firstName}
            onChangeText={(text) => handleInputChange('firstName', text)}
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
            placeholder="Last Name"
            placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
            value={formData.lastName}
            onChangeText={(text) => handleInputChange('lastName', text)}
          />
          
          <ThemedText style={styles.sectionTitle}>Account Details</ThemedText>
          
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
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
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
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
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
            value={formData.confirmPassword}
            onChangeText={(text) => handleInputChange('confirmPassword', text)}
            secureTextEntry
          />
          
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isLoading ? '#cccccc' : Colors[colorScheme ?? 'light'].tint }
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <ThemedText style={styles.buttonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </ThemedText>
          </TouchableOpacity>
          
          <ThemedView style={styles.loginContainer}>
            <ThemedText>Already have an account? </ThemedText>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <ThemedText style={styles.loginLink}>Log In</ThemedText>
              </TouchableOpacity>
            </Link>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 40,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  loginLink: {
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
});
