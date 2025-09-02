import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { TeamMember } from '../models/TeamMember';

interface Props {
  member: TeamMember;
  currentUserId: string;
  onRequestHelp: (memberId: string, message: string) => void;
  onBorrowItem: (lenderId: string, itemName: string) => void;
}

export const RequestHelp: React.FC<Props> = ({
  member,
  currentUserId,
  onRequestHelp,
  onBorrowItem,
}) => {
  const [message, setMessage] = useState('');
  const [itemToBorrow, setItemToBorrow] = useState('');

  const handleRequestHelp = () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message describing what help you need.');
      return;
    }

    onRequestHelp(member.id, message);
    setMessage('');
    Alert.alert('Success', `Help request sent to ${member.name}!`);
  };

  const handleBorrowItem = () => {
    if (!itemToBorrow.trim()) {
      Alert.alert('Error', 'Please enter the item you want to borrow.');
      return;
    }

    // Check if the item is in the member's tools
    if (!member.tools.some(tool => tool.toLowerCase() === itemToBorrow.toLowerCase())) {
      Alert.alert('Warning', `${itemToBorrow} is not listed in ${member.name}'s tools. Do you still want to request it?`, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, Request Anyway',
          onPress: () => {
            onBorrowItem(member.id, itemToBorrow);
            setItemToBorrow('');
            Alert.alert('Success', `Request to borrow ${itemToBorrow} sent to ${member.name}!`);
          },
        },
      ]);
      return;
    }

    onBorrowItem(member.id, itemToBorrow);
    setItemToBorrow('');
    Alert.alert('Success', `Request to borrow ${itemToBorrow} sent to ${member.name}!`);
  };

  // Don't allow requesting help from yourself
  if (member.id === currentUserId) {
    return (
      <View style={styles.container}>
        <Text style={styles.noticeText}>This is your profile</Text>
      </View>
    );
  }

  // Don't allow requesting help if the member is not willing to help
  if (!member.willingToHelp) {
    return (
      <View style={styles.container}>
        <Text style={styles.noticeText}>
          {member.name} is not currently available to help
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Request Help</Text>
        <TextInput
          style={styles.input}
          placeholder="Describe what help you need..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <Button title="Send Help Request" onPress={handleRequestHelp} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Borrow Item</Text>
        <TextInput
          style={styles.input}
          placeholder="What item do you want to borrow?"
          value={itemToBorrow}
          onChangeText={setItemToBorrow}
        />
        <Button title="Send Borrow Request" onPress={handleBorrowItem} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 12,
  },
  noticeText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
  },
});
