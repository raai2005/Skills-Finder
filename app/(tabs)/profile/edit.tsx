import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock data for the current user profile
const CURRENT_USER = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://picsum.photos/id/1027/300/300',
  role: 'Software Engineer',
  company: 'TechInnovate',
  location: 'San Francisco, CA',
  bio: 'Full-stack developer with a passion for AI and machine learning. Always looking to collaborate on innovative projects.',
  skills: ['React Native', 'TypeScript', 'Node.js', 'Python', 'TensorFlow', 'AWS'],
  interests: ['AI', 'Mobile Dev', 'IoT', 'Robotics'],
};

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  
  const [formData, setFormData] = useState({
    name: CURRENT_USER.name,
    email: CURRENT_USER.email,
    role: CURRENT_USER.role,
    company: CURRENT_USER.company,
    location: CURRENT_USER.location,
    bio: CURRENT_USER.bio,
    skills: CURRENT_USER.skills.join(', '),
    interests: CURRENT_USER.interests.join(', '),
  });
  
  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSave = () => {
    // Validate the form
    if (!formData.name.trim() || !formData.email.trim()) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
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
    }, 500);
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
            source={{ uri: CURRENT_USER.avatar }} 
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
            <ThemedText style={styles.label}>Email</ThemedText>
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
            <ThemedText style={styles.label}>Role</ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].border
                }
              ]}
              value={formData.role}
              onChangeText={(text) => handleChange('role', text)}
              placeholder="Your professional role"
              placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
            />
          </ThemedView>
          
          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Company</ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].border
                }
              ]}
              value={formData.company}
              onChangeText={(text) => handleChange('company', text)}
              placeholder="Your company or organization"
              placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
            />
          </ThemedView>
          
          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Location</ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].border
                }
              ]}
              value={formData.location}
              onChangeText={(text) => handleChange('location', text)}
              placeholder="Your location"
              placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
            />
          </ThemedView>
          
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
              placeholder="Write something about yourself"
              placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </ThemedView>
          
          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Skills (comma separated)</ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].border
                }
              ]}
              value={formData.skills}
              onChangeText={(text) => handleChange('skills', text)}
              placeholder="Your skills (comma separated)"
              placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
            />
          </ThemedView>
          
          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Interests (comma separated)</ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].border
                }
              ]}
              value={formData.interests}
              onChangeText={(text) => handleChange('interests', text)}
              placeholder="Your interests (comma separated)"
              placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
            />
          </ThemedView>
          
          <TouchableOpacity 
            style={[
              styles.saveButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint }
            ]}
            onPress={handleSave}
          >
            <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <ThemedText>Cancel</ThemedText>
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
  photoSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  changePhotoText: {
    color: 'white',
    fontWeight: '500',
  },
  formSection: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
  },
  saveButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
});
