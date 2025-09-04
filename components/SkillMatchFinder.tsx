import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { AuthUser } from '@/services/AuthService';
import { Image } from 'expo-image';

export function SkillMatchFinder() {
  const { user, findUsersBySkills } = useAuth();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [matchedUsers, setMatchedUsers] = useState<AuthUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const mutedColor = useThemeColor({}, 'tabIconDefault');
  
  // Toggle skill selection
  const toggleSkillSelection = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  
  // Find users with matching skills
  const findMatches = async () => {
    if (selectedSkills.length === 0) return;
    
    setIsLoading(true);
    try {
      const users = await findUsersBySkills(selectedSkills);
      // Filter out current user
      const filteredUsers = users.filter(u => u.id !== user?.id);
      setMatchedUsers(filteredUsers);
      setHasSearched(true);
    } catch (error) {
      console.error('Error finding matches:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get user skills to choose from
  const userSkills = user?.skills || [];
  
  // Default image for users without photos
  const defaultAvatar = 'https://ui-avatars.com/api/?background=random';
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>Find Users with Similar Skills</Text>
      
      <Text style={[styles.subtitle, { color: textColor }]}>Select skills to match:</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.skillsContainer}>
        {userSkills.map((skill) => (
          <Pressable
            key={skill}
            style={[
              styles.skillBadge,
              { 
                backgroundColor: selectedSkills.includes(skill) ? tintColor : mutedColor,
                opacity: selectedSkills.includes(skill) ? 1 : 0.7,
              }
            ]}
            onPress={() => toggleSkillSelection(skill)}
          >
            <Text style={styles.skillText}>{skill}</Text>
            {selectedSkills.includes(skill) && (
              <Ionicons name="checkmark-circle" size={16} color="#ffffff" style={styles.checkIcon} />
            )}
          </Pressable>
        ))}
      </ScrollView>
      
      <Pressable
        style={[
          styles.findButton,
          { 
            backgroundColor: selectedSkills.length > 0 ? tintColor : mutedColor,
            opacity: selectedSkills.length > 0 ? 1 : 0.5,
          }
        ]}
        onPress={findMatches}
        disabled={selectedSkills.length === 0 || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.findButtonText}>
            Find Matches ({selectedSkills.length} selected)
          </Text>
        )}
      </Pressable>
      
      {hasSearched && (
        <View style={styles.resultsContainer}>
          <Text style={[styles.resultsTitle, { color: textColor }]}>
            {matchedUsers.length > 0 
              ? `Found ${matchedUsers.length} users with similar skills` 
              : 'No matches found'}
          </Text>
          
          <ScrollView style={styles.userList}>
            {matchedUsers.map((matchedUser) => (
              <View key={matchedUser.id} style={[styles.userCard, { backgroundColor }]}>
                <Image
                  source={{ uri: matchedUser.photoURL || `${defaultAvatar}&name=${encodeURIComponent(matchedUser.name)}` }}
                  style={styles.userAvatar}
                  contentFit="cover"
                />
                
                <View style={styles.userInfo}>
                  <Text style={[styles.userName, { color: textColor }]}>{matchedUser.name}</Text>
                  
                  {matchedUser.githubUsername && (
                    <Text style={[styles.githubUsername, { color: mutedColor }]}>
                      <Ionicons name="logo-github" size={14} color={mutedColor} /> @{matchedUser.githubUsername}
                    </Text>
                  )}
                  
                  <View style={styles.matchedSkillsContainer}>
                    {matchedUser.skills.filter(skill => selectedSkills.includes(skill)).map((skill) => (
                      <View key={skill} style={[styles.matchedSkill, { backgroundColor: tintColor }]}>
                        <Text style={styles.matchedSkillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  skillText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: 4,
  },
  findButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  findButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  resultsContainer: {
    marginTop: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  userList: {
    maxHeight: 400,
  },
  userCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  // React Native 0.79: use boxShadow instead of shadow*
  boxShadow: '0px 1px 1.41px rgba(0,0,0,0.2)',
  elevation: 2,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  githubUsername: {
    fontSize: 14,
    marginBottom: 8,
  },
  matchedSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  matchedSkill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  matchedSkillText: {
    color: '#ffffff',
    fontSize: 12,
  },
});

export default SkillMatchFinder;
