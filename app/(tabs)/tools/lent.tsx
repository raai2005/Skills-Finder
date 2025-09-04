import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Stack, router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Define the LentTool type
type LentTool = {
  id: string;
  name: string;
  borrower: string;
  borrowerId: string;
  lentDate: string;
  returnDate: string;
  image: string;
  status: 'active' | 'overdue' | 'returned' | 'request';
};

// Mock data for lent tools
const LENT_TOOLS: LentTool[] = [
  {
    id: '1',
    name: 'Arduino Uno',
    borrower: 'Riley Taylor',
    borrowerId: '201',
    lentDate: '2023-11-15',
    returnDate: '2023-11-22',
    image: 'https://picsum.photos/id/1021/400/300',
    status: 'active',
  },
  {
    id: '2',
    name: 'Digital Multimeter',
    borrower: 'Jordan Patel',
    borrowerId: '202',
    lentDate: '2023-11-10',
    returnDate: '2023-11-17',
    image: 'https://picsum.photos/id/1026/400/300',
    status: 'overdue',
  },
  {
    id: '3',
    name: 'Soldering Station',
    borrower: 'Casey Lee',
    borrowerId: '203',
    lentDate: '2023-11-02',
    returnDate: '2023-11-09',
    image: 'https://picsum.photos/id/1023/400/300',
    status: 'returned',
  },
  {
    id: '4',
    name: 'Raspberry Pi 4',
    borrower: 'Alex Johnson',
    borrowerId: '204',
    lentDate: '',
    returnDate: '',
    image: 'https://picsum.photos/id/1024/400/300',
    status: 'request',
  },
];

export default function LentToolsScreen() {
  const colorScheme = useColorScheme();

  const handleAcceptReturn = (id: string) => {
    Alert.alert(
      'Accept Return',
      'Confirm that you have received this tool back?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
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

  const handleSendReminder = (id: string) => {
    // Simulate API call
    setTimeout(() => {
      Alert.alert('Reminder Sent', 'A return reminder has been sent to the borrower.');
    }, 500);
  };

  const handleApproveRequest = (id: string, approve: boolean) => {
    Alert.alert(
      approve ? 'Approve Request' : 'Decline Request',
      `Are you sure you want to ${approve ? 'approve' : 'decline'} this borrowing request?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            // Simulate API call
            setTimeout(() => {
              Alert.alert('Success', `Request has been ${approve ? 'approved' : 'declined'}.`);
            }, 500);
          },
        },
      ]
    );
  };

  const renderLentItem = ({ item }: { item: LentTool }) => {
    const isActive = item.status === 'active';
    const isOverdue = item.status === 'overdue';
    const isReturned = item.status === 'returned';
    const isRequest = item.status === 'request';

    let statusColor = Colors[colorScheme ?? 'light'].success;
    if (isOverdue) statusColor = Colors[colorScheme ?? 'light'].error;
    if (isReturned) statusColor = Colors[colorScheme ?? 'light'].text;
    if (isRequest) statusColor = Colors[colorScheme ?? 'light'].warning;

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
          <ThemedText style={styles.itemBorrower}>
            {isRequest ? 'Request from:' : 'Borrowed by:'} {item.borrower}
          </ThemedText>
          
          {!isRequest && (
            <>
              <ThemedView style={styles.dateContainer}>
                <ThemedText style={styles.dateLabel}>Lent:</ThemedText>
                <ThemedText style={styles.dateValue}>{item.lentDate}</ThemedText>
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
            </>
          )}
          
          <ThemedView style={[
            styles.statusContainer,
            { backgroundColor: statusColor + '20' }
          ]}>
            <ThemedText style={[styles.statusText, { color: statusColor }]}>
              {isActive ? 'Active' : isOverdue ? 'Overdue' : isReturned ? 'Returned' : 'Request'}
            </ThemedText>
          </ThemedView>
          
          {isRequest && (
            <ThemedView style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  { backgroundColor: Colors[colorScheme ?? 'light'].success }
                ]}
                onPress={() => handleApproveRequest(item.id, true)}
              >
                <ThemedText style={styles.actionButtonText}>Approve</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  { backgroundColor: Colors[colorScheme ?? 'light'].error },
                  styles.declineButton,
                ]}
                onPress={() => handleApproveRequest(item.id, false)}
              >
                <ThemedText style={styles.actionButtonText}>Decline</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
          
          {(isActive || isOverdue) && (
            <ThemedView style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  { backgroundColor: Colors[colorScheme ?? 'light'].tint }
                ]}
                onPress={() => handleAcceptReturn(item.id)}
              >
                <ThemedText style={styles.actionButtonText}>Mark Returned</ThemedText>
              </TouchableOpacity>
              
              {isOverdue && (
                <TouchableOpacity 
                  style={[
                    styles.actionButton,
                    styles.reminderButton,
                    { backgroundColor: Colors[colorScheme ?? 'light'].secondaryTint }
                  ]}
                  onPress={() => handleSendReminder(item.id)}
                >
                  <ThemedText style={styles.actionButtonText}>Send Reminder</ThemedText>
                </TouchableOpacity>
              )}
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
          title: 'Lent Tools',
          headerShown: true,
        }}
      />
      
      <ThemedView style={styles.container}>
        {LENT_TOOLS.length > 0 ? (
          <FlatList
            data={LENT_TOOLS}
            renderItem={renderLentItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              You haven't lent any tools yet.
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.browseButton,
                { backgroundColor: Colors[colorScheme ?? 'light'].tint }
              ]}
              onPress={() => router.push('/(tabs)/tools' as any)}
            >
              <ThemedText style={styles.browseButtonText}>
                Manage Your Tools
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
  boxShadow: '0px 1px 2px rgba(0,0,0,0.1)',
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
  itemBorrower: {
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
  reminderButton: {
    marginLeft: 8,
  },
  declineButton: {
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
