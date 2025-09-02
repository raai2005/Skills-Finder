import React, { useState } from 'react';
import { StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for teams
const TEAMS = [
  { id: '1', name: 'Green Coders', hackathon: 'Climate Tech Hackathon' },
  { id: '2', name: 'HealthHackers', hackathon: 'Health Innovation Challenge' },
  { id: '3', name: 'Urban Coders', hackathon: 'Smart Cities Hackathon' },
];

export default function ApplyToTeamScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  
  const team = TEAMS.find(t => t.id === id);
  
  const [skills, setSkills] = useState(user?.skills.join(', ') || '');
  const [experience, setExperience] = useState('');
  const [motivation, setMotivation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!skills || !experience || !motivation) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      Alert.alert(
        'Success', 
        'Your application has been submitted! The team will review your application and contact you if they are interested.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            }
          }
        ]
      );
      setIsLoading(false);
    }, 1000);
  };

  if (!team) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Team not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Apply to Team',
          headerShown: true 
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <ThemedText style={styles.title}>Apply to Join</ThemedText>
        <ThemedText style={styles.subtitle}>
          {team.name} - {team.hackathon}
        </ThemedText>
        
        <ThemedView style={styles.formContainer}>
          <ThemedText style={styles.label}>Your Skills</ThemedText>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].border
              }
            ]}
            placeholder="List your relevant skills (e.g. React Native, UX Design)"
            placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
            value={skills}
            onChangeText={setSkills}
          />
          
          <ThemedText style={styles.label}>Relevant Experience</ThemedText>
          <TextInput
            style={[
              styles.textArea,
              { 
                backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].border
              }
            ]}
            placeholder="Describe your relevant experience for this team"
            placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
            value={experience}
            onChangeText={setExperience}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          
          <ThemedText style={styles.label}>Why do you want to join this team?</ThemedText>
          <TextInput
            style={[
              styles.textArea,
              { 
                backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].border
              }
            ]}
            placeholder="Explain why you want to join this team and what you can contribute"
            placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
            value={motivation}
            onChangeText={setMotivation}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isLoading ? '#cccccc' : Colors[colorScheme ?? 'light'].tint }
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <ThemedText style={styles.buttonText}>
              {isLoading ? 'Submitting...' : 'Submit Application'}
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
    paddingBottom: 40,
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
    paddingBottom: 12,
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
