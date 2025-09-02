import React, { useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, TextInput, View, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

// Define Tool type
type Tool = {
  id: string;
  name: string;
  category: string;
  owner: string;
  ownerId: string;
  image: string;
  isAvailable: boolean;
};

// Mock data for tools
const TOOLS: Tool[] = [
  {
    id: '1',
    name: 'Arduino Uno',
    category: 'Electronics',
    owner: 'Alex Johnson',
    ownerId: '101',
    image: 'https://picsum.photos/id/1021/200',
    isAvailable: true,
  },
  {
    id: '2',
    name: '3D Printer (Ender 3)',
    category: 'Fabrication',
    owner: 'Morgan Smith',
    ownerId: '102',
    image: 'https://picsum.photos/id/1022/200',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Soldering Station',
    category: 'Electronics',
    owner: 'Taylor Green',
    ownerId: '103',
    image: 'https://picsum.photos/id/1023/200',
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Raspberry Pi 4',
    category: 'Computing',
    owner: 'Jamie Wilson',
    ownerId: '104',
    image: 'https://picsum.photos/id/1024/200',
    isAvailable: false,
  },
  {
    id: '5',
    name: 'Digital Oscilloscope',
    category: 'Electronics',
    owner: 'Sam Rivera',
    ownerId: '201',
    image: 'https://picsum.photos/id/1025/200',
    isAvailable: true,
  },
  {
    id: '6',
    name: 'Power Drill Kit',
    category: 'Hand Tools',
    owner: 'Jordan Patel',
    ownerId: '202',
    image: 'https://picsum.photos/id/1026/200',
    isAvailable: true,
  },
  {
    id: '7',
    name: 'VR Headset (Meta Quest 2)',
    category: 'Computing',
    owner: 'Casey Lee',
    ownerId: '203',
    image: 'https://picsum.photos/id/1027/200',
    isAvailable: false,
  },
];

// Categories for filtering
const CATEGORIES = [
  'All',
  'Electronics',
  'Fabrication',
  'Computing',
  'Hand Tools',
];

export default function ToolsScreen() {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredTools, setFilteredTools] = useState(TOOLS);

  const filterTools = (query: string, category: string) => {
    let filtered = TOOLS;
    
    // Filter by search query
    if (query.trim()) {
      const searchTerms = query.toLowerCase();
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(searchTerms) ||
        tool.owner.toLowerCase().includes(searchTerms) ||
        tool.category.toLowerCase().includes(searchTerms)
      );
    }
    
    // Filter by category
    if (category !== 'All') {
      filtered = filtered.filter(tool => tool.category === category);
    }
    
    // Only show available tools
    filtered = filtered.filter(tool => tool.isAvailable);
    
    setFilteredTools(filtered);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    filterTools(text, selectedCategory);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    filterTools(searchQuery, category);
  };

  const renderToolItem = ({ item }: { item: Tool }) => (
    <TouchableOpacity
      style={[
        styles.toolCard,
        { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
      ]}
      onPress={() => router.push({
        pathname: '/(tabs)/tools/[id]' as any,
        params: { id: item.id }
      })}
      disabled={!item.isAvailable}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.toolImage}
      />
      <ThemedView style={styles.toolInfo}>
        <ThemedText style={styles.toolName}>{item.name}</ThemedText>
        <ThemedText style={styles.toolCategory}>{item.category}</ThemedText>
        <ThemedText style={styles.toolOwner}>Owner: {item.owner}</ThemedText>
        
        <ThemedView style={[
          styles.statusChip,
          { 
            backgroundColor: item.isAvailable 
              ? Colors[colorScheme ?? 'light'].success + '33' 
              : Colors[colorScheme ?? 'light'].error + '33'
          }
        ]}>
          <ThemedText style={[
            styles.statusText,
            { 
              color: item.isAvailable 
                ? Colors[colorScheme ?? 'light'].success 
                : Colors[colorScheme ?? 'light'].error
            }
          ]}>
            {item.isAvailable ? 'Available' : 'Borrowed'}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Tools Directory</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Borrow tools from other members</ThemedText>
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
          placeholder="Search for tools..."
          placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {CATEGORIES.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              { 
                backgroundColor: selectedCategory === category 
                  ? Colors[colorScheme ?? 'light'].tint 
                  : Colors[colorScheme ?? 'light'].inputBackground
              }
            ]}
            onPress={() => handleCategorySelect(category)}
          >
            <ThemedText 
              style={[
                styles.categoryText,
                { 
                  color: selectedCategory === category 
                    ? 'white' 
                    : Colors[colorScheme ?? 'light'].text
                }
              ]}
            >
              {category}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={[
            styles.actionButton,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={() => router.push('/(tabs)/tools/borrowed' as any)}
        >
          <ThemedText style={styles.actionButtonText}>My Borrowed Tools</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.actionButton,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={() => router.push('/(tabs)/tools/lent' as any)}
        >
          <ThemedText style={styles.actionButtonText}>My Lent Tools</ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTools}
        renderItem={renderToolItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No tools found matching your search.</ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
}

import { ScrollView } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
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
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
  toolCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  toolImage: {
    width: 100,
    height: 100,
  },
  toolInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  toolName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  toolCategory: {
    fontSize: 14,
    marginBottom: 2,
  },
  toolOwner: {
    fontSize: 14,
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
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
