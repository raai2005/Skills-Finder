import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

// Mock data for hackathons
const HACKATHONS = [
  {
    id: '1',
    title: 'Climate Tech Hackathon',
    date: 'September 15-17, 2025',
    location: 'Virtual',
    description: 'Build solutions to address climate change challenges.',
    teamCount: 12,
    image: 'https://picsum.photos/id/1002/200',
  },
  {
    id: '2',
    title: 'Health Innovation Challenge',
    date: 'October 5-7, 2025',
    location: 'New York, NY',
    description: 'Create healthcare solutions for underserved communities.',
    teamCount: 20,
    image: 'https://picsum.photos/id/1003/200',
  },
  {
    id: '3',
    title: 'Smart Cities Hackathon',
    date: 'October 20-22, 2025',
    location: 'San Francisco, CA',
    description: 'Design innovative solutions for future smart cities.',
    teamCount: 15,
    image: 'https://picsum.photos/id/1015/200',
  },
  {
    id: '4',
    title: 'EdTech for All',
    date: 'November 10-12, 2025',
    location: 'Chicago, IL',
    description: 'Build educational technology for inclusive learning.',
    teamCount: 8,
    image: 'https://picsum.photos/id/1025/200',
  },
];

// Define the Hackathon type
type Hackathon = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  teamCount: number;
  image: string;
};

export default function HackathonsScreen() {
  const colorScheme = useColorScheme();

  const renderHackathonItem = ({ item }: { item: Hackathon }) => (
    <TouchableOpacity
      style={[
        styles.hackathonCard,
        { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
      ]}
      onPress={() => router.push(`/(tabs)/hackathons/${item.id}`)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.hackathonImage}
      />
      <ThemedView style={styles.cardContent}>
        <ThemedText style={styles.hackathonTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.hackathonDate}>{item.date}</ThemedText>
        <ThemedText style={styles.hackathonLocation}>{item.location}</ThemedText>
        <ThemedText style={styles.hackathonDescription} numberOfLines={2}>
          {item.description}
        </ThemedText>
        <ThemedText style={styles.teamCount}>Teams: {item.teamCount}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Hackathons</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Find competitions to join</ThemedText>
      </ThemedView>

      <FlatList
        data={HACKATHONS}
        renderItem={renderHackathonItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
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
  listContainer: {
    paddingBottom: 20,
  },
  hackathonCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  hackathonImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 16,
  },
  hackathonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  hackathonDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  hackathonLocation: {
    fontSize: 14,
    marginBottom: 8,
  },
  hackathonDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  teamCount: {
    fontSize: 14,
    fontWeight: '500',
  },
});
