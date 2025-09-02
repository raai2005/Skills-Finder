import React, { useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

// Mock data for teams
const TEAMS = [
  {
    id: '1',
    name: 'Green Coders',
    hackathon: 'Climate Tech Hackathon',
    members: 4,
    skills: ['React Native', 'Node.js', 'UI/UX Design', 'AWS'],
    lookingFor: ['UI/UX Designer', 'Backend Developer'],
  },
  {
    id: '2',
    name: 'HealthHackers',
    hackathon: 'Health Innovation Challenge',
    members: 3,
    skills: ['Machine Learning', 'Python', 'Data Science', 'Healthcare'],
    lookingFor: ['Mobile Developer', 'Healthcare Specialist'],
  },
  {
    id: '3',
    name: 'Urban Coders',
    hackathon: 'Smart Cities Hackathon',
    members: 5,
    skills: ['IoT', 'React', 'Flutter', 'Firebase', 'Hardware Prototyping'],
    lookingFor: ['IoT Specialist'],
  },
  {
    id: '4',
    name: 'EdCoders',
    hackathon: 'EdTech for All',
    members: 3,
    skills: ['Python', 'React', 'Web Development', 'Education'],
    lookingFor: ['Content Creator', 'Backend Developer'],
  },
  {
    id: '5',
    name: 'AI Medical',
    hackathon: 'Health Innovation Challenge',
    members: 3,
    skills: ['TensorFlow', 'Python', 'Healthcare', 'Data Visualization'],
    lookingFor: ['Machine Learning Engineer', 'UI Designer'],
  },
];

export default function TeamsScreen() {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTeams, setFilteredTeams] = useState(TEAMS);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (!text.trim()) {
      setFilteredTeams(TEAMS);
      return;
    }
    
    const searchTerms = text.toLowerCase().split(/[ ,]+/);
    
    const filtered = TEAMS.filter(team => {
      // Search in team name
      const nameMatch = team.name.toLowerCase().includes(text.toLowerCase());
      
      // Search in hackathon name
      const hackathonMatch = team.hackathon.toLowerCase().includes(text.toLowerCase());
      
      // Search in skills (check if any of the search terms match any skill)
      const skillsMatch = team.skills.some(skill => 
        searchTerms.some(term => skill.toLowerCase().includes(term))
      );
      
      // Search in looking for roles
      const roleMatch = team.lookingFor.some(role => 
        searchTerms.some(term => role.toLowerCase().includes(term))
      );
      
      return nameMatch || hackathonMatch || skillsMatch || roleMatch;
    });
    
    setFilteredTeams(filtered);
  };

  const renderTeamItem = ({ item }: { item: (typeof TEAMS)[0] }) => (
    <TouchableOpacity
      style={[
        styles.teamCard,
        { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
      ]}
      onPress={() => router.push(`/(tabs)/teams/${item.id}`)}
    >
      <ThemedText style={styles.teamName}>{item.name}</ThemedText>
      <ThemedText style={styles.hackathonName}>{item.hackathon}</ThemedText>
      <ThemedText style={styles.memberCount}>Members: {item.members}</ThemedText>
      
      <ThemedView style={styles.skillsContainer}>
        <ThemedText style={styles.skillsTitle}>Team Skills:</ThemedText>
        <ThemedView style={styles.skillsList}>
          {item.skills.map((skill: string, index: number) => (
            <ThemedView 
              key={index} 
              style={[styles.skillChip, { backgroundColor: Colors[colorScheme ?? 'light'].tint + '33' }]}
            >
              <ThemedText style={styles.skillText}>{skill}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>
      
      {item.lookingFor.length > 0 && (
        <ThemedView style={styles.lookingForContainer}>
          <ThemedText style={styles.lookingForTitle}>Looking for:</ThemedText>
          <ThemedView style={styles.rolesList}>
            {item.lookingFor.map((role: string, index: number) => (
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
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Teams</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Find teams looking for members</ThemedText>
      </ThemedView>

      <View style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color={Colors[colorScheme ?? 'light'].text} 
          style={styles.searchIcon} 
        />
        <TextInput
          style={[
            styles.searchInput,
            { 
              backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: Colors[colorScheme ?? 'light'].border
            }
          ]}
          placeholder="Search by skill, role, or team name..."
          placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredTeams}
        renderItem={renderTeamItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No teams found matching your search.</ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchIcon: {
    position: 'absolute',
    zIndex: 1,
    left: 12,
  },
  searchInput: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 40,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  teamCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hackathonName: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  memberCount: {
    fontSize: 14,
    marginBottom: 12,
  },
  skillsContainer: {
    marginBottom: 12,
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 12,
  },
  lookingForContainer: {
    marginTop: 4,
  },
  lookingForTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  rolesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
