import React, { useState } from 'react';
import { StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  
  const [settings, setSettings] = useState({
    darkMode: colorScheme === 'dark',
    notifications: true,
    emailNotifications: true,
    teamInvites: true,
    hackathonUpdates: true,
    toolRequests: true,
    dataUsage: false,
  });
  
  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    // For dark mode, we'd need to actually change the theme
    if (key === 'darkMode') {
      Alert.alert(
        'Theme Change',
        'This would change the app theme in a real implementation',
        [{ text: 'OK' }]
      );
    }
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In a real app, this would call an API to delete the user's account
            Alert.alert('Account deleted', 'Your account has been deleted.');
          },
        },
      ]
    );
  };
  
  const handleResetPassword = () => {
    Alert.alert(
      'Reset Password',
      'Are you sure you want to reset your password?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: () => {
            // In a real app, this would call an API to send a password reset email
            Alert.alert('Password Reset', 'A password reset link has been sent to your email.');
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Settings',
          headerShown: true,
        }}
      />
      
      <ScrollView style={styles.container}>
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Appearance</ThemedText>
          
          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfo}>
              <Ionicons 
                name="moon-outline" 
                size={24} 
                color={Colors[colorScheme ?? 'light'].text} 
              />
              <ThemedText style={styles.settingText}>Dark Mode</ThemedText>
            </ThemedView>
            <Switch
              value={settings.darkMode}
              onValueChange={() => toggleSetting('darkMode')}
              trackColor={{ 
                false: '#d9d9d9', 
                true: Colors[colorScheme ?? 'light'].tint + '80'
              }}
              thumbColor={settings.darkMode ? Colors[colorScheme ?? 'light'].tint : '#f4f3f4'}
            />
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Notifications</ThemedText>
          
          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfo}>
              <Ionicons 
                name="notifications-outline" 
                size={24} 
                color={Colors[colorScheme ?? 'light'].text} 
              />
              <ThemedText style={styles.settingText}>Push Notifications</ThemedText>
            </ThemedView>
            <Switch
              value={settings.notifications}
              onValueChange={() => toggleSetting('notifications')}
              trackColor={{ 
                false: '#d9d9d9', 
                true: Colors[colorScheme ?? 'light'].tint + '80'
              }}
              thumbColor={settings.notifications ? Colors[colorScheme ?? 'light'].tint : '#f4f3f4'}
            />
          </ThemedView>
          
          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfo}>
              <Ionicons 
                name="mail-outline" 
                size={24} 
                color={Colors[colorScheme ?? 'light'].text} 
              />
              <ThemedText style={styles.settingText}>Email Notifications</ThemedText>
            </ThemedView>
            <Switch
              value={settings.emailNotifications}
              onValueChange={() => toggleSetting('emailNotifications')}
              trackColor={{ 
                false: '#d9d9d9', 
                true: Colors[colorScheme ?? 'light'].tint + '80'
              }}
              thumbColor={settings.emailNotifications ? Colors[colorScheme ?? 'light'].tint : '#f4f3f4'}
            />
          </ThemedView>
          
          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfo}>
              <Ionicons 
                name="people-outline" 
                size={24} 
                color={Colors[colorScheme ?? 'light'].text} 
              />
              <ThemedText style={styles.settingText}>Team Invites</ThemedText>
            </ThemedView>
            <Switch
              value={settings.teamInvites}
              onValueChange={() => toggleSetting('teamInvites')}
              trackColor={{ 
                false: '#d9d9d9', 
                true: Colors[colorScheme ?? 'light'].tint + '80'
              }}
              thumbColor={settings.teamInvites ? Colors[colorScheme ?? 'light'].tint : '#f4f3f4'}
            />
          </ThemedView>
          
          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfo}>
              <Ionicons 
                name="trophy-outline" 
                size={24} 
                color={Colors[colorScheme ?? 'light'].text} 
              />
              <ThemedText style={styles.settingText}>Hackathon Updates</ThemedText>
            </ThemedView>
            <Switch
              value={settings.hackathonUpdates}
              onValueChange={() => toggleSetting('hackathonUpdates')}
              trackColor={{ 
                false: '#d9d9d9', 
                true: Colors[colorScheme ?? 'light'].tint + '80'
              }}
              thumbColor={settings.hackathonUpdates ? Colors[colorScheme ?? 'light'].tint : '#f4f3f4'}
            />
          </ThemedView>
          
          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfo}>
              <Ionicons 
                name="hammer-outline" 
                size={24} 
                color={Colors[colorScheme ?? 'light'].text} 
              />
              <ThemedText style={styles.settingText}>Tool Requests</ThemedText>
            </ThemedView>
            <Switch
              value={settings.toolRequests}
              onValueChange={() => toggleSetting('toolRequests')}
              trackColor={{ 
                false: '#d9d9d9', 
                true: Colors[colorScheme ?? 'light'].tint + '80'
              }}
              thumbColor={settings.toolRequests ? Colors[colorScheme ?? 'light'].tint : '#f4f3f4'}
            />
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Privacy</ThemedText>
          
          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfo}>
              <Ionicons 
                name="analytics-outline" 
                size={24} 
                color={Colors[colorScheme ?? 'light'].text} 
              />
              <ThemedText style={styles.settingText}>Allow Anonymous Data Collection</ThemedText>
            </ThemedView>
            <Switch
              value={settings.dataUsage}
              onValueChange={() => toggleSetting('dataUsage')}
              trackColor={{ 
                false: '#d9d9d9', 
                true: Colors[colorScheme ?? 'light'].tint + '80'
              }}
              thumbColor={settings.dataUsage ? Colors[colorScheme ?? 'light'].tint : '#f4f3f4'}
            />
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleResetPassword}
          >
            <ThemedView style={styles.actionButtonContent}>
              <Ionicons 
                name="key-outline" 
                size={24} 
                color={Colors[colorScheme ?? 'light'].text} 
              />
              <ThemedText style={styles.actionButtonText}>Reset Password</ThemedText>
            </ThemedView>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={Colors[colorScheme ?? 'light'].text} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDeleteAccount}
          >
            <ThemedView style={styles.actionButtonContent}>
              <Ionicons 
                name="trash-outline" 
                size={24} 
                color={Colors[colorScheme ?? 'light'].error} 
              />
              <ThemedText style={[styles.actionButtonText, { color: Colors[colorScheme ?? 'light'].error }]}>
                Delete Account
              </ThemedText>
            </ThemedView>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={Colors[colorScheme ?? 'light'].error} 
            />
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.footer}>
          <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    marginLeft: 16,
  },
  deleteButton: {
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
  },
  version: {
    fontSize: 14,
    opacity: 0.7,
  },
});
