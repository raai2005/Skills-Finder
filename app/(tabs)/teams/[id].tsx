import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock data for teams
const TEAMS = [
  {
    id: '1',
    name: 'Green Coders',
    hackathon: 'Climate Tech Hackathon',
    hackathonId: '1',
    members: [
      { id: '101', name: 'Alex Johnson', role: 'Team Lead', skills: ['React Native', 'Node.js'], avatar: 'https://picsum.photos/id/1001/200' },
      { id: '102', name: 'Morgan Smith', role: 'Frontend Developer', skills: ['React', 'UI/UX Design'], avatar: 'https://picsum.photos/id/1002/200' },
      { id: '103', name: 'Taylor Green', role: 'Backend Developer', skills: ['Node.js', 'AWS'], avatar: 'https://picsum.photos/id/1003/200' },
      { id: '104', name: 'Jamie Wilson', role: 'Data Scientist', skills: ['Python', 'Machine Learning'], avatar: 'https://picsum.photos/id/1004/200' },
    ],
    skills: ['React Native', 'Node.js', 'UI/UX Design', 'AWS'],
    lookingFor: ['UI/UX Designer', 'Backend Developer'],
    projectDescription: 'We are building a mobile app that helps track and reduce carbon footprints for individuals and small businesses. Our app will integrate with IoT devices to provide real-time data and actionable insights.',
  },
  {
    id: '2',
    name: 'HealthHackers',
    hackathon: 'Health Innovation Challenge',
    hackathonId: '2',
    members: [
      { id: '201', name: 'Sam Rivera', role: 'Team Lead', skills: ['Machine Learning', 'Python'], avatar: 'https://picsum.photos/id/1005/200' },
      { id: '202', name: 'Jordan Patel', role: 'Data Scientist', skills: ['Data Science', 'Healthcare'], avatar: 'https://picsum.photos/id/1006/200' },
      { id: '203', name: 'Casey Lee', role: 'UX Researcher', skills: ['UI/UX', 'Healthcare'], avatar: 'https://picsum.photos/id/1007/200' },
    ],
    skills: ['Machine Learning', 'Python', 'Data Science', 'Healthcare'],
    lookingFor: ['Mobile Developer', 'Healthcare Specialist'],
    projectDescription: 'Our team is developing an AI-powered mobile application that helps underserved communities access telemedicine services. The app will include features for symptom assessment, doctor matching, and appointment scheduling.',
  },
  {
    id: '3',
    name: 'Urban Coders',
    hackathon: 'Smart Cities Hackathon',
    hackathonId: '3',
    members: [
      { id: '301', name: 'Riley Chen', role: 'Team Lead', skills: ['IoT', 'React'], avatar: 'https://picsum.photos/id/1008/200' },
      { id: '302', name: 'Avery Williams', role: 'Mobile Developer', skills: ['Flutter', 'Firebase'], avatar: 'https://picsum.photos/id/1009/200' },
      { id: '303', name: 'Quinn Martinez', role: 'Hardware Engineer', skills: ['IoT', 'Hardware Prototyping'], avatar: 'https://picsum.photos/id/1010/200' },
      { id: '304', name: 'Drew Thompson', role: 'UI Designer', skills: ['UI/UX', 'Figma'], avatar: 'https://picsum.photos/id/1011/200' },
      { id: '305', name: 'Cameron Black', role: 'Backend Developer', skills: ['Node.js', 'AWS'], avatar: 'https://picsum.photos/id/1012/200' },
    ],
    skills: ['IoT', 'React', 'Flutter', 'Firebase', 'Hardware Prototyping'],
    lookingFor: ['IoT Specialist'],
    projectDescription: 'We are creating a smart waste management system for urban areas that uses IoT sensors, mobile apps, and data analytics to optimize waste collection routes and schedules. Our solution aims to reduce carbon emissions and operational costs for cities.',
  }
];

export default function TeamDetailsScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  
  const team = TEAMS.find(t => t.id === id);
  
  if (!team) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Team not found</ThemedText>
      </ThemedView>
    );
  }

  const handleApply = () => {
    router.push(`/(tabs)/teams/apply/${team.id}`);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: team.name,
          headerShown: true 
        }} 
      />
      <ScrollView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.teamName}>{team.name}</ThemedText>
          
          <TouchableOpacity
            onPress={() => router.push(`/(tabs)/hackathons/${team.hackathonId}`)}
          >
            <ThemedText style={styles.hackathonName}>{team.hackathon}</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Project Description</ThemedText>
          <ThemedText style={styles.description}>{team.projectDescription}</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Team Skills</ThemedText>
          <ThemedView style={styles.skillsList}>
            {team.skills.map((skill, index) => (
              <ThemedView 
                key={index} 
                style={[
                  styles.skillChip,
                  { backgroundColor: Colors[colorScheme ?? 'light'].tint + '33' }
                ]}
              >
                <ThemedText style={styles.skillText}>{skill}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
        
        {team.lookingFor.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Looking For</ThemedText>
            <ThemedView style={styles.skillsList}>
              {team.lookingFor.map((role, index) => (
                <ThemedView 
                  key={index} 
                  style={[
                    styles.roleChip,
                    { backgroundColor: Colors[colorScheme ?? 'light'].tint }
                  ]}
                >
                  <ThemedText style={styles.roleText}>{role}</ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        )}
        
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Team Members ({team.members.length})</ThemedText>
          {team.members.map(member => (
            <ThemedView key={member.id} style={styles.memberCard}>
              <Image 
                source={{ uri: member.avatar }} 
                style={styles.avatar}
              />
              <ThemedView style={styles.memberInfo}>
                <ThemedText style={styles.memberName}>{member.name}</ThemedText>
                <ThemedText style={styles.memberRole}>{member.role}</ThemedText>
                <ThemedView style={styles.memberSkills}>
                  {member.skills.map((skill, index) => (
                    <ThemedText key={index} style={styles.memberSkill}>
                      {skill}{index < member.skills.length - 1 ? ', ' : ''}
                    </ThemedText>
                  ))}
                </ThemedView>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>
        
        {team.lookingFor.length > 0 && (
          <TouchableOpacity 
            style={[
              styles.applyButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint }
            ]}
            onPress={handleApply}
          >
            <ThemedText style={styles.applyButtonText}>Apply to Join Team</ThemedText>
          </TouchableOpacity>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 20,
  },
  teamName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hackathonName: {
    fontSize: 16,
    color: Colors.light.tint,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 14,
  },
  roleChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 14,
    color: 'white',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  memberInfo: {
    marginLeft: 12,
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
  },
  memberRole: {
    fontSize: 14,
    marginBottom: 4,
  },
  memberSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memberSkill: {
    fontSize: 12,
    opacity: 0.7,
  },
  applyButton: {
    margin: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
