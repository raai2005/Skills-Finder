import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TeamMember } from '../models/TeamMember';

interface Props {
  skills: string[];
  onSelectSkill: (skill: string) => void;
}

export const SkillsAnalytics: React.FC<Props> = ({ skills, onSelectSkill }) => {
  // Count occurrences of each skill
  const skillCounts = skills.reduce<Record<string, number>>((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {});

  // Convert to array and sort by count (descending)
  const sortedSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8); // Take top 8 skills

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Team Skills Analytics</Text>
      <View style={styles.skillsContainer}>
        {sortedSkills.map(([skill, count], index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.skillBar, 
              { 
                width: `${Math.max(30, (count / Math.max(...sortedSkills.map(s => s[1]))) * 100)}%`,
                backgroundColor: getSkillColor(index)
              }
            ]}
            onPress={() => onSelectSkill(skill)}
          >
            <Text style={styles.skillText}>{skill} ({count})</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Generate colors for skill bars
const getSkillColor = (index: number) => {
  const colors = [
    '#4287f5', '#42c5f5', '#42f5d7', '#42f54e',
    '#b8f542', '#f5e642', '#f5a142', '#f54242'
  ];
  return colors[index % colors.length];
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
  skillsContainer: {
    gap: 8,
  },
  skillBar: {
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  skillText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
