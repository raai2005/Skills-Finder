import React from 'react';
import { StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for the current user profile
const CURRENT_USER = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://picsum.photos/id/1027/300/300',
  role: 'Software Engineer',
  company: 'TechInnovate',
  location: 'San Francisco, CA',
  bio: 'Full-stack developer with a passion for AI and machine learning. Always looking to collaborate on innovative projects.',
  skills: ['React Native', 'TypeScript', 'Node.js', 'Python', 'TensorFlow', 'AWS'],
  interests: ['AI', 'Mobile Dev', 'IoT', 'Robotics'],
  hackathonsJoined: 5,
  projectsCompleted: 12,
  rating: 4.8,
};

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => logout(),
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }}
      />

      <ScrollView style={styles.container}>
        <ThemedView style={styles.header}>
          <Image 
            source={{ uri: CURRENT_USER.avatar }} 
            style={styles.avatar} 
          />
          <ThemedText style={styles.name}>{CURRENT_USER.name}</ThemedText>
          <ThemedText style={styles.role}>{CURRENT_USER.role}</ThemedText>
          <ThemedText style={styles.location}>
            <Ionicons name="location" size={16} /> {CURRENT_USER.location}
          </ThemedText>
          
          <TouchableOpacity 
            style={[
              styles.editButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint }
            ]}
            onPress={() => router.push('/(tabs)/profile/edit' as any)}
          >
            <ThemedText style={styles.editButtonText}>Edit Profile</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Bio</ThemedText>
          <ThemedText style={styles.bioText}>{CURRENT_USER.bio}</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Skills</ThemedText>
          <ThemedView style={styles.tagsContainer}>
            {CURRENT_USER.skills.map((skill, index) => (
              <ThemedView 
                key={index} 
                style={[
                  styles.tag,
                  { backgroundColor: Colors[colorScheme ?? 'light'].tint + '20' }
                ]}
              >
                <ThemedText style={[
                  styles.tagText,
                  { color: Colors[colorScheme ?? 'light'].tint }
                ]}>
                  {skill}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Interests</ThemedText>
          <ThemedView style={styles.tagsContainer}>
            {CURRENT_USER.interests.map((interest, index) => (
              <ThemedView 
                key={index} 
                style={[
                  styles.tag,
                  { backgroundColor: Colors[colorScheme ?? 'light'].secondaryTint + '20' }
                ]}
              >
                <ThemedText style={[
                  styles.tagText,
                  { color: Colors[colorScheme ?? 'light'].secondaryTint }
                ]}>
                  {interest}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.statsSection}>
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statValue}>{CURRENT_USER.hackathonsJoined}</ThemedText>
            <ThemedText style={styles.statLabel}>Hackathons</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statValue}>{CURRENT_USER.projectsCompleted}</ThemedText>
            <ThemedText style={styles.statLabel}>Projects</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statValue}>{CURRENT_USER.rating}</ThemedText>
            <ThemedText style={styles.statLabel}>Rating</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
          
          <ThemedView style={styles.menuSection}>
            <Link href={'/(tabs)/profile/settings' as any} asChild>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons 
                  name="settings-outline" 
                  size={24} 
                  color={Colors[colorScheme ?? 'light'].text} 
                />
                <ThemedText style={styles.menuItemText}>Settings</ThemedText>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={Colors[colorScheme ?? 'light'].text} 
                />
              </TouchableOpacity>
            </Link>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons 
                name="log-out-outline" 
                size={24} 
                color={Colors[colorScheme ?? 'light'].error} 
              />
              <ThemedText style={[styles.menuItemText, { color: Colors[colorScheme ?? 'light'].error }]}>Logout</ThemedText>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={Colors[colorScheme ?? 'light'].error} 
              />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsSection: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  menuSection: {
    padding: 16,
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
  },
});
