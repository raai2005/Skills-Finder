import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Linking, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Image } from 'expo-image';

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
}

interface GitHubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

export function GitHubProfileView() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const mutedColor = useThemeColor({}, 'tabIconDefault');
  
  useEffect(() => {
    if (user?.githubUsername) {
      fetchGitHubProfile();
    }
  }, [user?.githubUsername]);
  
  const fetchGitHubProfile = async () => {
    if (!user?.githubUsername) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch GitHub profile
      const profileResponse = await fetch(`https://api.github.com/users/${user.githubUsername}`);
      if (!profileResponse.ok) {
        throw new Error('Failed to fetch GitHub profile');
      }
      const profileData = await profileResponse.json();
      setProfile(profileData);
      
      // Fetch GitHub repositories
      const reposResponse = await fetch(`https://api.github.com/users/${user.githubUsername}/repos?sort=updated&per_page=5`);
      if (!reposResponse.ok) {
        throw new Error('Failed to fetch GitHub repositories');
      }
      const reposData = await reposResponse.json();
      setRepos(reposData);
    } catch (err) {
      console.error('Error fetching GitHub data:', err);
      setError('Failed to load GitHub profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // If no GitHub account is linked
  if (!user?.githubUsername) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: textColor }]}>GitHub Profile</Text>
        <Text style={[styles.message, { color: mutedColor }]}>
          No GitHub account linked. Sign in with GitHub to connect your profile.
        </Text>
      </View>
    );
  }
  
  // Show loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: textColor }]}>GitHub Profile</Text>
        <ActivityIndicator size="large" color={tintColor} style={styles.loader} />
      </View>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: textColor }]}>GitHub Profile</Text>
        <Text style={[styles.errorMessage, { color: 'red' }]}>{error}</Text>
        <Pressable
          style={[styles.retryButton, { backgroundColor: tintColor }]}
          onPress={fetchGitHubProfile}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>GitHub Profile</Text>
      
      {profile && (
        <View style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <Image 
              source={{ uri: profile.avatar_url }} 
              style={styles.avatar}
              contentFit="cover"
            />
            
            <View style={styles.profileInfo}>
              <Text style={[styles.name, { color: textColor }]}>{profile.name || profile.login}</Text>
              <Text style={[styles.username, { color: mutedColor }]}>@{profile.login}</Text>
              
              <Pressable 
                style={styles.profileLink}
                onPress={() => Linking.openURL(profile.html_url)}
              >
                <Text style={[styles.profileLinkText, { color: tintColor }]}>View Profile</Text>
                <Ionicons name="open-outline" size={16} color={tintColor} />
              </Pressable>
            </View>
          </View>
          
          {profile.bio && (
            <Text style={[styles.bio, { color: textColor }]}>{profile.bio}</Text>
          )}
          
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: textColor }]}>{profile.public_repos}</Text>
              <Text style={[styles.statLabel, { color: mutedColor }]}>Repositories</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: textColor }]}>{profile.followers}</Text>
              <Text style={[styles.statLabel, { color: mutedColor }]}>Followers</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: textColor }]}>{profile.following}</Text>
              <Text style={[styles.statLabel, { color: mutedColor }]}>Following</Text>
            </View>
          </View>
          
          <Text style={[styles.repositoriesTitle, { color: textColor }]}>Recent Repositories</Text>
          
          {repos.length > 0 ? (
            repos.map(repo => (
              <Pressable 
                key={repo.id}
                style={[styles.repoCard, { backgroundColor }]}
                onPress={() => Linking.openURL(repo.html_url)}
              >
                <View style={styles.repoHeader}>
                  <Text style={[styles.repoName, { color: textColor }]}>{repo.name}</Text>
                  <Ionicons name="star-outline" size={16} color={mutedColor} />
                  <Text style={[styles.repoStars, { color: mutedColor }]}>{repo.stargazers_count}</Text>
                </View>
                
                {repo.description && (
                  <Text 
                    style={[styles.repoDescription, { color: mutedColor }]}
                    numberOfLines={2}
                  >
                    {repo.description}
                  </Text>
                )}
                
                {repo.language && (
                  <View style={styles.repoLanguage}>
                    <View 
                      style={[
                        styles.languageDot, 
                        { backgroundColor: getLanguageColor(repo.language) }
                      ]} 
                    />
                    <Text style={[styles.languageText, { color: mutedColor }]}>
                      {repo.language}
                    </Text>
                  </View>
                )}
              </Pressable>
            ))
          ) : (
            <Text style={[styles.message, { color: mutedColor }]}>No repositories found</Text>
          )}
        </View>
      )}
    </View>
  );
}

// Helper function to get color for programming language
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Python: '#3572A5',
    Java: '#b07219',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Go: '#00ADD8',
    Ruby: '#701516',
    PHP: '#4F5D95',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    Rust: '#dea584',
    Dart: '#00B4AB',
  };
  
  return colors[language] || '#8257e6';
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
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 24,
  },
  loader: {
    marginVertical: 24,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  profileContainer: {
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 16,
    justifyContent: 'center',
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 14,
    marginBottom: 4,
  },
  profileLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileLinkText: {
    fontSize: 14,
    marginRight: 4,
  },
  bio: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(150, 150, 150, 0.3)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
  },
  repositoriesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  repoCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  boxShadow: '0px 1px 1.41px rgba(0,0,0,0.2)',
  elevation: 2,
  },
  repoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  repoName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  repoStars: {
    fontSize: 14,
    marginLeft: 4,
  },
  repoDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  repoLanguage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  languageText: {
    fontSize: 12,
  },
});

export default GitHubProfileView;
