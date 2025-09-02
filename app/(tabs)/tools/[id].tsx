import React, { useState } from 'react';
import { StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock data for tools
const TOOLS = [
  {
    id: '1',
    name: 'Arduino Uno',
    category: 'Electronics',
    owner: 'Alex Johnson',
    ownerId: '101',
    image: 'https://picsum.photos/id/1021/400/300',
    description: 'Arduino Uno is a microcontroller board based on the ATmega328P. It has 14 digital input/output pins, 6 analog inputs, a 16 MHz ceramic resonator, a USB connection, a power jack, an ICSP header and a reset button. Perfect for beginners and prototyping.',
    condition: 'Excellent',
    additionalItems: 'Includes USB cable, breadboard, and basic sensor kit',
    isAvailable: true,
  },
  {
    id: '2',
    name: '3D Printer (Ender 3)',
    category: 'Fabrication',
    owner: 'Morgan Smith',
    ownerId: '102',
    image: 'https://picsum.photos/id/1022/400/300',
    description: 'Creality Ender 3 3D printer. Great for rapid prototyping and creating physical components for your projects. Print volume: 220x220x250mm. Works with PLA, ABS, PETG, and other filaments.',
    condition: 'Good',
    additionalItems: 'Comes with 1kg PLA filament and basic tools',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Soldering Station',
    category: 'Electronics',
    owner: 'Taylor Green',
    ownerId: '103',
    image: 'https://picsum.photos/id/1023/400/300',
    description: 'Professional soldering station with adjustable temperature control. Perfect for electronic projects and PCB work. Temperature range: 200°C - 480°C.',
    condition: 'Good',
    additionalItems: 'Includes solder wire, flux, and various soldering tips',
    isAvailable: true,
  },
];

export default function ToolDetailsScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const [showBorrowOptions, setShowBorrowOptions] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  
  const tool = TOOLS.find(t => t.id === id);
  
  if (!tool) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Tool not found</ThemedText>
      </ThemedView>
    );
  }

  const handleBorrowRequest = () => {
    if (!selectedDuration) {
      Alert.alert('Error', 'Please select a borrow duration');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      Alert.alert(
        'Request Sent', 
        `Your request to borrow ${tool.name} for ${selectedDuration} has been sent to ${tool.owner}. You'll be notified when they respond.`,
        [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            }
          }
        ]
      );
    }, 500);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: tool.name,
          headerShown: true 
        }} 
      />
      <ScrollView style={styles.container}>
        <Image
          source={{ uri: tool.image }}
          style={styles.toolImage}
        />
        
        <ThemedView style={styles.content}>
          <ThemedText style={styles.toolName}>{tool.name}</ThemedText>
          <ThemedText style={styles.toolCategory}>{tool.category}</ThemedText>
          
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Description</ThemedText>
            <ThemedText style={styles.description}>{tool.description}</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Details</ThemedText>
            
            <ThemedView style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Owner:</ThemedText>
              <ThemedText style={styles.detailValue}>{tool.owner}</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Condition:</ThemedText>
              <ThemedText style={styles.detailValue}>{tool.condition}</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Includes:</ThemedText>
              <ThemedText style={styles.detailValue}>{tool.additionalItems}</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Status:</ThemedText>
              <ThemedView style={[
                styles.statusChip,
                { 
                  backgroundColor: tool.isAvailable 
                    ? Colors[colorScheme ?? 'light'].success + '33' 
                    : Colors[colorScheme ?? 'light'].error + '33'
                }
              ]}>
                <ThemedText style={[
                  styles.statusText,
                  { 
                    color: tool.isAvailable 
                      ? Colors[colorScheme ?? 'light'].success 
                      : Colors[colorScheme ?? 'light'].error
                  }
                ]}>
                  {tool.isAvailable ? 'Available' : 'Borrowed'}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
          
          {tool.isAvailable && !showBorrowOptions && (
            <TouchableOpacity 
              style={[
                styles.borrowButton,
                { backgroundColor: Colors[colorScheme ?? 'light'].tint }
              ]}
              onPress={() => setShowBorrowOptions(true)}
            >
              <ThemedText style={styles.borrowButtonText}>Borrow This Tool</ThemedText>
            </TouchableOpacity>
          )}
          
          {showBorrowOptions && (
            <ThemedView style={styles.borrowOptionsContainer}>
              <ThemedText style={styles.sectionTitle}>Select Borrow Duration</ThemedText>
              
              {['1 day', '2-3 days', '1 week', '2 weeks'].map(duration => (
                <TouchableOpacity
                  key={duration}
                  style={[
                    styles.durationOption,
                    { 
                      backgroundColor: selectedDuration === duration 
                        ? Colors[colorScheme ?? 'light'].tint + '33' 
                        : Colors[colorScheme ?? 'light'].inputBackground
                    }
                  ]}
                  onPress={() => setSelectedDuration(duration)}
                >
                  <ThemedText style={styles.durationText}>{duration}</ThemedText>
                  {selectedDuration === duration && (
                    <ThemedView style={[
                      styles.checkmark,
                      { backgroundColor: Colors[colorScheme ?? 'light'].tint }
                    ]}>
                      <ThemedText style={styles.checkmarkText}>✓</ThemedText>
                    </ThemedView>
                  )}
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity 
                style={[
                  styles.confirmButton,
                  { backgroundColor: Colors[colorScheme ?? 'light'].tint }
                ]}
                onPress={handleBorrowRequest}
              >
                <ThemedText style={styles.confirmButtonText}>Confirm Request</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setShowBorrowOptions(false);
                  setSelectedDuration(null);
                }}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  toolName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  toolCategory: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
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
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    width: 90,
  },
  detailValue: {
    fontSize: 16,
    flex: 1,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  borrowButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  borrowButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  borrowOptionsContainer: {
    marginTop: 16,
  },
  durationOption: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationText: {
    fontSize: 16,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontWeight: 'bold',
  },
  confirmButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
  },
});
