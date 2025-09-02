import React, { useState } from 'react';
import { StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock data for hackathons
const HACKATHONS = [
  {
    id: '1',
    title: 'Climate Tech Hackathon',
  },
  {
    id: '2',
    title: 'Health Innovation Challenge',
  },
  {
    id: '3',
    title: 'Smart Cities Hackathon',
  },
  {
    id: '4',
    title: 'EdTech for All',
  },
];

export default function RequestMemberScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const hackathon = HACKATHONS.find(h => h.id === id);
  
  const [teamName, setTeamName] = useState('');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePostRequest = async () => {
    if (!teamName || !skills || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      Alert.alert(
        'Success', 
        'Your team member request has been posted successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to hackathon details
              router.back();
            }
          }
        ]
      );
      setIsLoading(false);
    }, 1000);
  };

  if (!hackathon) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Hackathon not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Post Skill Requirement',
          headerShown: true 
        }} 
      />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <ThemedText style={styles.title}>Request Team Member</ThemedText>
        <ThemedText style={styles.subtitle}>
          For: {hackathon.title}
        </ThemedText>
        
        <ThemedView style={styles.formContainer}>
          <ThemedText style={styles.label}>Team Name</ThemedText>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].border
              }
            ]}
            placeholder="Enter your team name"
            placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
            value={teamName}
            onChangeText={setTeamName}
          />
          
          <ThemedText style={styles.label}>Skills Needed</ThemedText>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].border
              }
            ]}
            placeholder="e.g. React Native, UI Design, Machine Learning"
            placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
            value={skills}
            onChangeText={setSkills}
          />
          
          <ThemedText style={styles.label}>Description</ThemedText>
          <TextInput
            style={[
              styles.textArea,
              { 
                backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].border
              }
            ]}
            placeholder="Describe your team, project idea, and what you're looking for in a team member..."
            placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isLoading ? '#cccccc' : Colors[colorScheme ?? 'light'].tint }
            ]}
            onPress={handlePostRequest}
            disabled={isLoading}
          >
            <ThemedText style={styles.buttonText}>
              {isLoading ? 'Posting...' : 'Post Request'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
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
  textArea: {
    width: '100%',
    height: 120,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
