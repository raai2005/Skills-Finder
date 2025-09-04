import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert, Switch } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    bio: 'Full-stack developer with a passion for AI and machine learning.',
    skills: (user?.skills || []).join(', '),
    tools: (user?.tools || []).join(', '),
    linkedin: '',
    github: user?.githubUsername || '',
    website: ''
  });
  
  // State for toggling password change
  const [changePassword, setChangePassword] = useState(false);
  
  // State for toggling sections
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    socialLinks: true,
    skills: true
  });
  
  useEffect(() => {
    // Fetch the user profile data when the component mounts
    if (user) {
      // Fetch additional profile data from your service if needed
    }
  }, [user]);
  
  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section as keyof typeof prev]: !prev[section as keyof typeof prev]
    }));
  };
  
  const handleSave = async () => {
    // Validate the form
    if (!formData.name.trim() || !formData.email.trim()) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }
    
    // Password validation
    if (changePassword) {
      if (!formData.password) {
        Alert.alert('Error', 'Please enter a new password');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
    }
    
    try {
      // Prepare update data
      const updateData = {
        name: formData.name,
        // Only include password if user is changing it
        ...(changePassword && formData.password ? { password: formData.password } : {}),
        // Parse skills and tools from comma-separated string to array
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        tools: formData.tools.split(',').map(t => t.trim()).filter(Boolean),
      };
      
      if (user?.id) {
        const success = await updateProfile(updateData);
        
        if (success) {
          Alert.alert(
            'Success', 
            'Profile updated successfully',
            [
              {
                text: 'OK',
                onPress: () => router.back(),
              }
            ]
          );
        } else {
          Alert.alert('Error', 'Failed to update profile');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };
  
  const handleChangePhoto = () => {
    Alert.alert(
      'Change Profile Photo',
      'Select a photo source',
      [
        {
          text: 'Camera',
          onPress: () => console.log('Camera selected'),
        },
        {
          text: 'Photo Library',
          onPress: () => console.log('Photo Library selected'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Edit Profile',
          headerShown: true,
        }}
      />
      
      <ScrollView style={styles.container}>
        <ThemedView style={styles.photoSection}>
          <Image 
            source={{ uri: user?.photoURL || 'https://picsum.photos/id/1027/300/300' }} 
            style={styles.avatar}
          />
          <TouchableOpacity
            style={[
              styles.changePhotoButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint }
            ]}
            onPress={handleChangePhoto}
          >
            <ThemedText style={styles.changePhotoText}>Change Photo</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        {/* Basic Information Section */}
        <ThemedView style={styles.sectionHeader}>
          <TouchableOpacity 
            style={styles.sectionTitleContainer}
            onPress={() => toggleSection('basicInfo')}
          >
            <ThemedText style={styles.sectionTitle}>Basic Information</ThemedText>
            <Ionicons 
              name={expandedSections.basicInfo ? 'chevron-up' : 'chevron-down'} 
              size={24} 
              color={Colors[colorScheme ?? 'light'].text} 
            />
          </TouchableOpacity>
        </ThemedView>
        
        {expandedSections.basicInfo && (
          <ThemedView style={styles.formSection}>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>Name</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                    color: Colors[colorScheme ?? 'light'].text,
                    borderColor: Colors[colorScheme ?? 'light'].border
                  }
                ]}
                value={formData.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholder="Your name"
                placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
              />
            </ThemedView>
            
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>Email (User ID)</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                    color: Colors[colorScheme ?? 'light'].text,
                    borderColor: Colors[colorScheme ?? 'light'].border
                  }
                ]}
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                placeholder="Your email"
                placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </ThemedView>
            
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>Phone Number</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                    color: Colors[colorScheme ?? 'light'].text,
                    borderColor: Colors[colorScheme ?? 'light'].border
                  }
                ]}
                value={formData.phoneNumber}
                onChangeText={(text) => handleChange('phoneNumber', text)}
                placeholder="Your phone number"
                placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
                keyboardType="phone-pad"
              />
            </ThemedView>
            
            <ThemedView style={styles.inputGroup}>
              <ThemedView style={styles.rowBetween}>
                <ThemedText style={styles.label}>Change Password</ThemedText>
                <Switch
                  value={changePassword}
                  onValueChange={setChangePassword}
                  trackColor={{ 
                    false: '#767577', 
                    true: Colors[colorScheme ?? 'light'].tint + '80'
                  }}
                  thumbColor={changePassword ? Colors[colorScheme ?? 'light'].tint : '#f4f3f4'}
                />
              </ThemedView>
            </ThemedView>
            
            {changePassword && (
              <>
                <ThemedView style={styles.inputGroup}>
                  <ThemedText style={styles.label}>New Password</ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                        color: Colors[colorScheme ?? 'light'].text,
                        borderColor: Colors[colorScheme ?? 'light'].border
                      }
                    ]}
                    value={formData.password}
                    onChangeText={(text) => handleChange('password', text)}
                    placeholder="Enter new password"
                    placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
                    secureTextEntry
                  />
                </ThemedView>
                
                <ThemedView style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Confirm Password</ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                        color: Colors[colorScheme ?? 'light'].text,
                        borderColor: Colors[colorScheme ?? 'light'].border
                      }
                    ]}
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleChange('confirmPassword', text)}
                    placeholder="Confirm new password"
                    placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
                    secureTextEntry
                  />
                </ThemedView>
              </>
            )}
            
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>Bio</ThemedText>
              <TextInput
                style={[
                  styles.textArea,
                  { 
                    backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                    color: Colors[colorScheme ?? 'light'].text,
                    borderColor: Colors[colorScheme ?? 'light'].border
                  }
                ]}
                value={formData.bio}
                onChangeText={(text) => handleChange('bio', text)}
                placeholder="Tell us about yourself"
                placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </ThemedView>
          </ThemedView>
        )}
        
        {/* Social Links Section */}
        <ThemedView style={styles.sectionHeader}>
          <TouchableOpacity 
            style={styles.sectionTitleContainer}
            onPress={() => toggleSection('socialLinks')}
          >
            <ThemedText style={styles.sectionTitle}>Social Links</ThemedText>
            <Ionicons 
              name={expandedSections.socialLinks ? 'chevron-up' : 'chevron-down'} 
              size={24} 
              color={Colors[colorScheme ?? 'light'].text} 
            />
          </TouchableOpacity>
        </ThemedView>
        
        {expandedSections.socialLinks && (
          <ThemedView style={styles.formSection}>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>LinkedIn</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                    color: Colors[colorScheme ?? 'light'].text,
                    borderColor: Colors[colorScheme ?? 'light'].border
                  }
                ]}
                value={formData.linkedin}
                onChangeText={(text) => handleChange('linkedin', text)}
                placeholder="LinkedIn profile URL"
                placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
                autoCapitalize="none"
              />
            </ThemedView>
            
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>GitHub</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                    color: Colors[colorScheme ?? 'light'].text,
                    borderColor: Colors[colorScheme ?? 'light'].border
                  }
                ]}
                value={formData.github}
                onChangeText={(text) => handleChange('github', text)}
                placeholder="GitHub username"
                placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
                autoCapitalize="none"
              />
            </ThemedView>
            
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>Website</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                    color: Colors[colorScheme ?? 'light'].text,
                    borderColor: Colors[colorScheme ?? 'light'].border
                  }
                ]}
                value={formData.website}
                onChangeText={(text) => handleChange('website', text)}
                placeholder="Personal website URL"
                placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
                autoCapitalize="none"
              />
            </ThemedView>
          </ThemedView>
        )}
        
        {/* Skills & Tools Section */}
        <ThemedView style={styles.sectionHeader}>
          <TouchableOpacity 
            style={styles.sectionTitleContainer}
            onPress={() => toggleSection('skills')}
          >
            <ThemedText style={styles.sectionTitle}>Skills & Tools</ThemedText>
            <Ionicons 
              name={expandedSections.skills ? 'chevron-up' : 'chevron-down'} 
              size={24} 
              color={Colors[colorScheme ?? 'light'].text} 
            />
          </TouchableOpacity>
        </ThemedView>
        
        {expandedSections.skills && (
          <ThemedView style={styles.formSection}>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>Skills</ThemedText>
              <TextInput
                style={[
                  styles.textArea,
                  { 
                    backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                    color: Colors[colorScheme ?? 'light'].text,
                    borderColor: Colors[colorScheme ?? 'light'].border
                  }
                ]}
                value={formData.skills}
                onChangeText={(text) => handleChange('skills', text)}
                placeholder="Enter your skills (comma separated)"
                placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </ThemedView>
            
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>Tools</ThemedText>
              <TextInput
                style={[
                  styles.textArea,
                  { 
                    backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                    color: Colors[colorScheme ?? 'light'].text,
                    borderColor: Colors[colorScheme ?? 'light'].border
                  }
                ]}
                value={formData.tools}
                onChangeText={(text) => handleChange('tools', text)}
                placeholder="Enter tools you can provide (comma separated)"
                placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </ThemedView>
          </ThemedView>
        )}
        
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={handleSave}
        >
          <ThemedText style={styles.saveButtonText}>Save Profile</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  changePhotoButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changePhotoText: {
    color: 'white',
    fontWeight: '600',
  },
  sectionHeader: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  formSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
  },
  saveButton: {
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 30,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
