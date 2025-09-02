import React from 'react';
import { StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock data for hackathons
const HACKATHONS = [
  {
    id: '1',
    title: 'Climate Tech Hackathon',
    date: 'September 15-17, 2025',
    location: 'Virtual',
    description: 'Build innovative solutions to address climate change challenges. This hackathon brings together developers, designers, and climate experts to create technology that can help mitigate environmental impact and promote sustainability. Join us for 48 hours of coding, mentorship, and networking.',
    image: 'https://picsum.photos/id/1002/800/400',
    prize: '$10,000',
    registrationDeadline: 'September 10, 2025',
    teams: [
      { id: '101', name: 'Green Coders', members: 4, lookingFor: ['UI/UX Designer', 'Backend Developer'] },
      { id: '102', name: 'Climate Hackers', members: 3, lookingFor: ['Data Scientist', 'Frontend Developer'] },
      { id: '103', name: 'EcoTech', members: 5, lookingFor: [] },
    ]
  },
  {
    id: '2',
    title: 'Health Innovation Challenge',
    date: 'October 5-7, 2025',
    location: 'New York, NY',
    description: 'Create healthcare solutions for underserved communities. This hackathon focuses on developing accessible healthcare technology, telemedicine solutions, and medical innovations for communities with limited access to healthcare services. We welcome participants from diverse backgrounds including healthcare, technology, and design.',
    image: 'https://picsum.photos/id/1003/800/400',
    prize: '$15,000',
    registrationDeadline: 'September 25, 2025',
    teams: [
      { id: '201', name: 'MedTech Innovators', members: 4, lookingFor: ['Mobile Developer', 'Healthcare Specialist'] },
      { id: '202', name: 'HealthHackers', members: 5, lookingFor: [] },
      { id: '203', name: 'AI Medical', members: 3, lookingFor: ['Machine Learning Engineer', 'UI Designer'] },
    ]
  },
  {
    id: '3',
    title: 'Smart Cities Hackathon',
    date: 'October 20-22, 2025',
    location: 'San Francisco, CA',
    description: 'Design innovative solutions for future smart cities. This hackathon challenges participants to create technologies that can enhance urban living, improve infrastructure, and create more sustainable and efficient cities. From IoT solutions to smart mobility apps, bring your ideas to life!',
    image: 'https://picsum.photos/id/1015/800/400',
    prize: '$12,000',
    registrationDeadline: 'October 15, 2025',
    teams: [
      { id: '301', name: 'Urban Coders', members: 5, lookingFor: ['IoT Specialist'] },
      { id: '302', name: 'City Hackers', members: 3, lookingFor: ['Mobile Developer', 'Hardware Engineer'] },
    ]
  },
  {
    id: '4',
    title: 'EdTech for All',
    date: 'November 10-12, 2025',
    location: 'Chicago, IL',
    description: 'Build educational technology for inclusive learning. This hackathon focuses on creating educational tools and platforms that make learning accessible to all, including those with disabilities, in remote areas, or from underprivileged backgrounds. Join us to make a difference in education!',
    image: 'https://picsum.photos/id/1025/800/400',
    prize: '$8,000',
    registrationDeadline: 'November 1, 2025',
    teams: [
      { id: '401', name: 'Learning Innovators', members: 4, lookingFor: ['UX Researcher', 'Frontend Developer'] },
      { id: '402', name: 'EdCoders', members: 3, lookingFor: ['Content Creator', 'Backend Developer'] },
    ]
  },
];

export default function HackathonDetailsScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  
  const hackathon = HACKATHONS.find(h => h.id === id);
  
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
          title: hackathon.title,
          headerShown: true 
        }} 
      />
      <ScrollView style={styles.container}>
        <Image
          source={{ uri: hackathon.image }}
          style={styles.heroImage}
        />
        
        <ThemedView style={styles.content}>
          <ThemedText style={styles.title}>{hackathon.title}</ThemedText>
          
          <ThemedView style={styles.infoContainer}>
            <ThemedView style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Date</ThemedText>
              <ThemedText style={styles.infoValue}>{hackathon.date}</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Location</ThemedText>
              <ThemedText style={styles.infoValue}>{hackathon.location}</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Prize</ThemedText>
              <ThemedText style={styles.infoValue}>{hackathon.prize}</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Registration Deadline</ThemedText>
              <ThemedText style={styles.infoValue}>{hackathon.registrationDeadline}</ThemedText>
            </ThemedView>
          </ThemedView>
          
          <ThemedText style={styles.sectionTitle}>About</ThemedText>
          <ThemedText style={styles.description}>{hackathon.description}</ThemedText>
          
          <ThemedText style={styles.sectionTitle}>Teams</ThemedText>
          {hackathon.teams.map(team => (
            <TouchableOpacity
              key={team.id}
              style={[
                styles.teamCard,
                { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
              ]}
              onPress={() => router.push(`/teams/${team.id}`)}
            >
              <ThemedText style={styles.teamName}>{team.name}</ThemedText>
              <ThemedText style={styles.teamMembers}>Members: {team.members}</ThemedText>
              
              {team.lookingFor.length > 0 && (
                <ThemedView style={styles.lookingForContainer}>
                  <ThemedText style={styles.lookingForTitle}>Looking for:</ThemedText>
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
              )}
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity 
            style={[
              styles.requestButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint }
            ]}
            onPress={() => router.push(`/hackathons/request-member/${id}`)}
          >
            <ThemedText style={styles.requestButtonText}>Post Skill Requirement</ThemedText>
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
  heroImage: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  infoItem: {
    width: '50%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  teamCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  teamMembers: {
    fontSize: 14,
    marginBottom: 8,
  },
  lookingForContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  lookingForTitle: {
    fontSize: 14,
    marginRight: 8,
  },
  roleChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 12,
    color: 'white',
  },
  requestButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  requestButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
