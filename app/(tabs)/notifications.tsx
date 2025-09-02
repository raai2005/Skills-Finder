import React, { useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Define the Notification type
type Notification = {
  id: string;
  type: 'teamInvite' | 'hackathonUpdate' | 'toolRequest' | 'teamApproval' | 'toolBorrowed' | 'toolReturned';
  title: string;
  message: string;
  sender: string;
  timestamp: string;
  read: boolean;
  actionRequired: boolean;
};

// Mock data for notifications
const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'teamInvite',
    title: 'Team Invitation',
    message: 'You have been invited to join "AI Innovators" team for the upcoming hackathon.',
    sender: 'Morgan Smith',
    timestamp: '2023-11-20T10:30:00',
    read: false,
    actionRequired: true,
  },
  {
    id: '2',
    type: 'toolRequest',
    title: 'Tool Borrow Request',
    message: 'Riley Taylor wants to borrow your "Arduino Uno" for 1 week.',
    sender: 'Riley Taylor',
    timestamp: '2023-11-19T15:45:00',
    read: false,
    actionRequired: true,
  },
  {
    id: '3',
    type: 'hackathonUpdate',
    title: 'Hackathon Update',
    message: 'The "AI for Good" hackathon has been rescheduled to next month.',
    sender: 'Hackathon Organizers',
    timestamp: '2023-11-18T09:15:00',
    read: true,
    actionRequired: false,
  },
  {
    id: '4',
    type: 'teamApproval',
    title: 'Team Application Approved',
    message: 'Your request to join "Quantum Coders" has been approved!',
    sender: 'Jamie Wilson',
    timestamp: '2023-11-17T14:20:00',
    read: true,
    actionRequired: false,
  },
  {
    id: '5',
    type: 'toolBorrowed',
    title: 'Tool Borrowed',
    message: 'Your "Raspberry Pi 4" has been borrowed by Casey Lee.',
    sender: 'System',
    timestamp: '2023-11-16T11:10:00',
    read: true,
    actionRequired: false,
  },
  {
    id: '6',
    type: 'toolReturned',
    title: 'Tool Returned',
    message: 'Sam Rivera has returned your "Digital Oscilloscope".',
    sender: 'System',
    timestamp: '2023-11-15T16:30:00',
    read: true,
    actionRequired: false,
  },
];

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  
  // Format the timestamp to a readable format
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than 24 hours, show time
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Less than 7 days, show day of week
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString();
  };
  
  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
    
    // Handle different notification types
    if (notification.actionRequired) {
      switch (notification.type) {
        case 'teamInvite':
          handleTeamInvite(notification);
          break;
        case 'toolRequest':
          handleToolRequest(notification);
          break;
        default:
          // Just show the notification details
          showNotificationDetails(notification);
      }
    } else {
      // Just show the notification details
      showNotificationDetails(notification);
    }
  };
  
  const handleTeamInvite = (notification: Notification) => {
    Alert.alert(
      'Team Invitation',
      `${notification.sender} has invited you to join their team. Would you like to accept?`,
      [
        {
          text: 'Decline',
          style: 'cancel',
          onPress: () => {
            // Simulate API call
            setTimeout(() => {
              Alert.alert('Invitation Declined', 'You have declined the team invitation.');
            }, 500);
          },
        },
        {
          text: 'Accept',
          onPress: () => {
            // Simulate API call
            setTimeout(() => {
              Alert.alert('Invitation Accepted', 'You have joined the team!');
            }, 500);
          },
        },
      ]
    );
  };
  
  const handleToolRequest = (notification: Notification) => {
    Alert.alert(
      'Tool Borrow Request',
      `${notification.sender} wants to borrow your tool. Would you like to approve?`,
      [
        {
          text: 'Decline',
          style: 'cancel',
          onPress: () => {
            // Simulate API call
            setTimeout(() => {
              Alert.alert('Request Declined', 'You have declined the borrow request.');
            }, 500);
          },
        },
        {
          text: 'Approve',
          onPress: () => {
            // Simulate API call
            setTimeout(() => {
              Alert.alert('Request Approved', 'You have approved the borrow request!');
            }, 500);
          },
        },
      ]
    );
  };
  
  const showNotificationDetails = (notification: Notification) => {
    Alert.alert(notification.title, notification.message);
  };
  
  const handleClearAll = () => {
    Alert.alert(
      'Clear Notifications',
      'Are you sure you want to clear all notifications?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: () => setNotifications([]),
        },
      ]
    );
  };
  
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'teamInvite':
        return 'people';
      case 'hackathonUpdate':
        return 'trophy';
      case 'toolRequest':
        return 'hammer';
      case 'teamApproval':
        return 'checkmark-circle';
      case 'toolBorrowed':
        return 'arrow-forward-circle';
      case 'toolReturned':
        return 'arrow-back-circle';
      default:
        return 'notifications';
    }
  };
  
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        item.read ? styles.readNotification : styles.unreadNotification,
        { 
          backgroundColor: item.read 
            ? Colors[colorScheme ?? 'light'].cardBackground
            : Colors[colorScheme ?? 'light'].tint + '10'
        }
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <ThemedView style={styles.notificationIconContainer}>
        <Ionicons
          name={getNotificationIcon(item.type)}
          size={24}
          color={
            item.actionRequired
              ? Colors[colorScheme ?? 'light'].tint
              : Colors[colorScheme ?? 'light'].text
          }
        />
      </ThemedView>
      
      <ThemedView style={styles.notificationContent}>
        <ThemedView style={styles.notificationHeader}>
          <ThemedText style={styles.notificationTitle}>{item.title}</ThemedText>
          <ThemedText style={styles.notificationTime}>
            {formatTimestamp(item.timestamp)}
          </ThemedText>
        </ThemedView>
        
        <ThemedText 
          style={styles.notificationMessage}
          numberOfLines={2}
        >
          {item.message}
        </ThemedText>
        
        <ThemedText style={styles.notificationSender}>From: {item.sender}</ThemedText>
        
        {item.actionRequired && (
          <ThemedView style={styles.actionRequiredTag}>
            <ThemedText style={styles.actionRequiredText}>Action Required</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Notifications',
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity 
              style={styles.clearAllButton}
              onPress={handleClearAll}
            >
              <ThemedText style={styles.clearAllText}>Clear All</ThemedText>
            </TouchableOpacity>
          ),
        }}
      />
      
      <ThemedView style={styles.container}>
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <Ionicons
              name="notifications-off-outline"
              size={64}
              color={Colors[colorScheme ?? 'light'].text + '50'}
            />
            <ThemedText style={styles.emptyText}>
              No notifications to display
            </ThemedText>
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
  notificationItem: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  readNotification: {
    opacity: 0.8,
  },
  unreadNotification: {},
  notificationIconContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
    padding: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationSender: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  actionRequiredTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  actionRequiredText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#d68102',
  },
  clearAllButton: {
    marginRight: 16,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    opacity: 0.6,
  },
});
