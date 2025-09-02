import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Stack, router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Define the BorrowedTool type
type BorrowedTool = {
  id: string;
  name: string;
  owner: string;
  borrowedDate: string;
  returnDate: string;
  image: string;
  status: 'active' | 'overdue' | 'returned';
};

// Mock data for borrowed tools
const BORROWED_TOOLS: BorrowedTool[] = [
  {
    id: '1',
    name: '3D Printer (Ender 3)',
    owner: 'Morgan Smith',
    borrowedDate: '2023-11-10',
    returnDate: '2023-11-17',
    image: 'https://picsum.photos/id/1022/400/300',
    status: 'active',
  },
  {
    id: '2',
    name: 'Raspberry Pi 4',
    owner: 'Jamie Rodriguez',
    borrowedDate: '2023-11-05',
    returnDate: '2023-11-12',
    image: 'https://picsum.photos/id/1024/400/300',
    status: 'overdue',
  },
  {
    id: '3',
    name: 'Arduino Starter Kit',
    owner: 'Sam Wilson',
    borrowedDate: '2023-10-28',
    returnDate: '2023-11-04',
    image: 'https://picsum.photos/id/1025/400/300',
    status: 'returned',
  },
];

export default function BorrowedToolsScreen() {
  const colorScheme = useColorScheme();

  const handleReturn = (id: string) => {
    Alert.alert(
      'Return Tool',
      'Are you sure you want to mark this tool as returned?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Return',
          onPress: () => {
            // Simulate API call
            setTimeout(() => {
              Alert.alert('Success', 'Tool has been marked as returned.');
            }, 500);
          },
        },
      ]
    );
  };

  const handleExtend = (id: string) => {
    Alert.alert(
      'Extend Borrowing Period',
      'How many additional days would you like?',
      [
        {
          text: '3 days',
          onPress: () => {
            // Simulate API call
            setTimeout(() => {
              Alert.alert('Request Sent', 'Your extension request has been sent to the owner.');
            }, 500);
          },
        },
        {
          text: '1 week',
          onPress: () => {
            // Simulate API call
            setTimeout(() => {
              Alert.alert('Request Sent', 'Your extension request has been sent to the owner.');
            }, 500);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const renderBorrowedItem = ({ item }: { item: BorrowedTool }) => {
    const isActive = item.status === 'active';
    const isOverdue = item.status === 'overdue';
    const isReturned = item.status === 'returned';

    let statusColor = Colors[colorScheme ?? 'light'].success;
    if (isOverdue) statusColor = Colors[colorScheme ?? 'light'].error;
    if (isReturned) statusColor = Colors[colorScheme ?? 'light'].text;

    return (
      <TouchableOpacity 
        style={styles.itemContainer}
        onPress={() => router.push({
          pathname: '/(tabs)/tools/[id]' as any,
          params: { id: item.id }
        })}
      >
        <Image source={{ uri: item.image }} style={styles.toolImage} />
        <ThemedView style={styles.itemDetails}>
          <ThemedText style={styles.itemName}>{item.name}</ThemedText>
          <ThemedText style={styles.itemOwner}>From: {item.owner}</ThemedText>
          
          <ThemedView style={styles.dateContainer}>
            <ThemedText style={styles.dateLabel}>Borrowed:</ThemedText>
            <ThemedText style={styles.dateValue}>{item.borrowedDate}</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.dateContainer}>
            <ThemedText style={styles.dateLabel}>Return by:</ThemedText>
            <ThemedText style={[
              styles.dateValue, 
              isOverdue && { color: Colors[colorScheme ?? 'light'].error }
            ]}>
              {item.returnDate}
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={[
            styles.statusContainer,
            { backgroundColor: statusColor + '20' }
          ]}>
            <ThemedText style={[styles.statusText, { color: statusColor }]}>
              {isActive ? 'Active' : isOverdue ? 'Overdue' : 'Returned'}
            </ThemedText>
          </ThemedView>
          
          {(isActive || isOverdue) && (
            <ThemedView style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  { backgroundColor: Colors[colorScheme ?? 'light'].tint }
                ]}
                onPress={() => handleReturn(item.id)}
              >
                <ThemedText style={styles.actionButtonText}>Return</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  styles.extendButton,
                  { backgroundColor: Colors[colorScheme ?? 'light'].secondaryTint }
                ]}
                onPress={() => handleExtend(item.id)}
              >
                <ThemedText style={styles.actionButtonText}>Extend</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
        </ThemedView>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Borrowed Tools',
          headerShown: true,
        }}
      />
      
      <ThemedView style={styles.container}>
        {BORROWED_TOOLS.length > 0 ? (
          <FlatList
            data={BORROWED_TOOLS}
            renderItem={renderBorrowedItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              You haven't borrowed any tools yet.
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.browseButton,
                { backgroundColor: Colors[colorScheme ?? 'light'].tint }
              ]}
              onPress={() => router.push('/(tabs)/tools' as any)}
            >
              <ThemedText style={styles.browseButtonText}>
                Browse Available Tools
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  toolImage: {
    width: 100,
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    padding: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemOwner: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  dateContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 13,
    width: 75,
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  statusContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  extendButton: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  browseButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
