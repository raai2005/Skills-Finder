import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { TeamMember } from '../models/TeamMember';

interface Props {
  members: TeamMember[];
  onSelectMember: (member: TeamMember) => void;
}

export const TeamMemberList: React.FC<Props> = ({ members, onSelectMember }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'skills' | 'tools'>('all');

  // Filter members based on search query and filter type
  const filteredMembers = members.filter(member => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    
    if (filterType === 'skills') {
      return member.skills.some(skill => skill.toLowerCase().includes(query));
    } else if (filterType === 'tools') {
      return member.tools.some(tool => tool.toLowerCase().includes(query));
    } else {
      // Search in both skills and tools
      return (
        member.name.toLowerCase().includes(query) ||
        member.skills.some(skill => skill.toLowerCase().includes(query)) ||
        member.tools.some(tool => tool.toLowerCase().includes(query))
      );
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search skills, tools, or names..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, filterType === 'all' && styles.activeFilter]}
            onPress={() => setFilterType('all')}
          >
            <Text>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterType === 'skills' && styles.activeFilter]}
            onPress={() => setFilterType('skills')}
          >
            <Text>Skills</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterType === 'tools' && styles.activeFilter]}
            onPress={() => setFilterType('tools')}
          >
            <Text>Tools</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.memberCard}
            onPress={() => onSelectMember(item)}
          >
            <Text style={styles.memberName}>{item.name}</Text>
            <View style={styles.tagsContainer}>
              {item.skills.map((skill, index) => (
                <View key={`skill-${index}`} style={styles.tag}>
                  <Text style={styles.tagText}>{skill}</Text>
                </View>
              ))}
            </View>
            <View style={styles.tagsContainer}>
              {item.tools.map((tool, index) => (
                <View key={`tool-${index}`} style={styles.tag}>
                  <Text style={styles.tagText}>{tool}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 2,
  },
  tagText: {
    fontSize: 12,
  },
});
