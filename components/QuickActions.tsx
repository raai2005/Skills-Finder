import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

interface Props {
  onCreateTeam: (teamName: string, description: string) => void;
}

export const QuickActions: React.FC<Props> = ({ onCreateTeam }) => {
  const actions = [
    { 
      title: "Create Team", 
      icon: "👥", 
      action: () => {
        onCreateTeam("New Project Team", "Collaboration team for the new project");
        Alert.alert("Team Created!", "New Project Team has been created successfully");
      } 
    },
    { 
      title: "Request Help", 
      icon: "🙋", 
      action: () => Alert.alert("Help Request", "Your help request has been broadcast to all available team members") 
    },
    { 
      title: "Schedule Meeting", 
      icon: "📅", 
      action: () => Alert.alert("Meeting Scheduled", "Team meeting scheduled for tomorrow at 10:00 AM") 
    },
    { 
      title: "Share Resource", 
      icon: "🔗", 
      action: () => Alert.alert("Resource Shared", "Your resource has been shared with the team") 
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.actionsContainer}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionButton}
            onPress={action.action}
          >
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text style={styles.actionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
