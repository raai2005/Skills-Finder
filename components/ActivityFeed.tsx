import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TeamMember } from '../models/TeamMember';

interface Props {
  allMembers: TeamMember[];
  onSelectActivity: (activity: { type: string; message: string; member: TeamMember }) => void;
}

export const ActivityFeed: React.FC<Props> = ({ allMembers, onSelectActivity }) => {
  // Generate some mock activities
  const [activities] = useState(() => {
    const types = ['borrowed', 'returned', 'joined', 'updated'];
    const items = ['Camera', 'Laptop', 'Projector', 'Whiteboard', 'Microphone', 'Headphones'];
    
    return Array(10).fill(null).map((_, i) => {
      const memberIndex = Math.floor(Math.random() * allMembers.length);
      const member = allMembers[memberIndex];
      const type = types[Math.floor(Math.random() * types.length)];
      let message = '';
      
      switch (type) {
        case 'borrowed':
          message = `${member.name} borrowed a ${items[Math.floor(Math.random() * items.length)]}`;
          break;
        case 'returned':
          message = `${member.name} returned a ${items[Math.floor(Math.random() * items.length)]}`;
          break;
        case 'joined':
          message = `${member.name} joined the team`;
          break;
        case 'updated':
          message = `${member.name} updated their skills`;
          break;
      }
      
      return {
        id: i.toString(),
        type,
        message,
        member,
        time: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000) // Random time in last 3 days
      };
    }).sort((a, b) => b.time.getTime() - a.time.getTime()); // Sort by time (newest first)
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'borrowed': return '📤';
      case 'returned': return '📥';
      case 'joined': return '👋';
      case 'updated': return '✏️';
      default: return '🔔';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      <View style={styles.feedContainer}>
        {activities.map((activity) => (
          <TouchableOpacity 
            key={activity.id} 
            style={styles.activityItem}
            onPress={() => onSelectActivity(activity)}
          >
            <Text style={styles.activityIcon}>{getActivityIcon(activity.type)}</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityMessage}>{activity.message}</Text>
              <Text style={styles.activityTime}>{formatTime(activity.time)}</Text>
            </View>
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
  feedContainer: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  activityIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
  },
  activityTime: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
});
