import React from 'react';
import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TeamMemberProfile } from '@/components/TeamMemberProfile';
import { TeamMember } from '@/models/TeamMember';
import TeamMemberService from '@/services/TeamMemberService';

// Component for the Header Section
const Header = () => (
  <ThemedView style={styles.titleContainer}>
    <ThemedText style={styles.oldSchoolTitle}>WELCOME</ThemedText>
    <ThemedText style={styles.oldSchoolSubtitle}>SKILLS FINDER v1.0</ThemedText>
    <View style={styles.oldSchoolDivider}></View>
  </ThemedView>
);

// Component for Stats Dashboard
const StatsDashboard = ({ stats }: { 
  stats: { 
    pendingRequests: number;
    activeProjects: number;
    teamMembers: number;
    skillsInDemand: string[];
  } 
}) => (
  <ThemedView style={styles.oldSchoolContainer}>
    <View style={styles.osHeader}>
      <ThemedText style={styles.osMenuTitle}>[ MAIN MENU ]</ThemedText>
    </View>

    {/* Stats Grid - Old School Style */}
    <View style={styles.osStatsGrid}>
      <View style={styles.osStatRow}>
        <View style={styles.osStatLabel}>
          <ThemedText style={styles.osMonoText}>PENDING REQUESTS:</ThemedText>
        </View>
        <View style={styles.osStatValue}>
          <ThemedText style={styles.osMonoText}>{stats.pendingRequests}</ThemedText>
        </View>
      </View>
      
      <View style={styles.osStatRow}>
        <View style={styles.osStatLabel}>
          <ThemedText style={styles.osMonoText}>ACTIVE PROJECTS:</ThemedText>
        </View>
        <View style={styles.osStatValue}>
          <ThemedText style={styles.osMonoText}>{stats.activeProjects}</ThemedText>
        </View>
      </View>

      <View style={styles.osStatRow}>
        <View style={styles.osStatLabel}>
          <ThemedText style={styles.osMonoText}>TEAM MEMBERS:</ThemedText>
        </View>
        <View style={styles.osStatValue}>
          <ThemedText style={styles.osMonoText}>{stats.teamMembers}</ThemedText>
        </View>
      </View>
      
      <View style={styles.osStatRow}>
        <View style={styles.osStatLabel}>
          <ThemedText style={styles.osMonoText}>URGENT NEEDS:</ThemedText>
        </View>
        <View style={styles.osStatValue}>
          <ThemedText style={styles.osMonoText}>5</ThemedText>
        </View>
      </View>
    </View>
  </ThemedView>
);

// Component for Skills in Demand
const SkillsInDemand = ({ skills }: { skills: string[] }) => (
  <ThemedView style={styles.oldSchoolContainer}>
    <View style={styles.osDivider}></View>
    <ThemedText style={styles.osMenuTitle}>[ SKILLS IN DEMAND ]</ThemedText>
    <View style={styles.osSkillsList}>
      {skills.map((skill: string, index: number) => (
        <View key={index} style={styles.osSkillRow}>
          <ThemedText style={styles.osMonoText}>{index + 1}. {skill}</ThemedText>
          <View style={styles.osSkillBar}>
            <View 
              style={[
                styles.osSkillBarFill, 
                {width: `${85 - (index * 15)}%`}
              ]} 
            />
          </View>
        </View>
      ))}
    </View>
  </ThemedView>
);

// Component for Member Profile Section
const ProfileSection = ({ 
  member, 
  onUpdate 
}: { 
  member: TeamMember; 
  onUpdate: (member: TeamMember) => void;
}) => (
  <ThemedView style={styles.osSection}>
    <ThemedText style={styles.osMenuTitle}>[ YOUR PROFILE ]</ThemedText>
    <View style={styles.osDivider}></View>
    <TeamMemberProfile member={member} onUpdate={onUpdate} />
  </ThemedView>
);

// Component for Upcoming Projects
const UpcomingProjects = () => (
  <ThemedView style={styles.osSection}>
    <ThemedText style={styles.osMenuTitle}>[ UPCOMING PROJECTS ]</ThemedText>
    <View style={styles.osDivider}></View>
    <View style={styles.osProjectCard}>
      <ThemedText style={styles.osProjectTitle}>{'>'} Website Redesign (2 days left)</ThemedText>
      <ThemedText style={styles.osMonoText}>
        Frontend development for the marketing site. Needs React skills.
      </ThemedText>
    </View>
    
    <View style={styles.osProjectCard}>
      <ThemedText style={styles.osProjectTitle}>{'>'} Data Analysis (URGENT)</ThemedText>
      <ThemedText style={styles.osMonoText}>
        Python script to analyze customer data and generate reports.
      </ThemedText>
      <ThemedText style={styles.osMonoText}>
        Team: Alice, Bob
      </ThemedText>
    </View>
  </ThemedView>
);

// Component for Skill Matches
const SkillMatches = () => (
  <ThemedView style={styles.osSection}>
    <ThemedText style={styles.osMenuTitle}>[ SKILL MATCHES ]</ThemedText>
    <View style={styles.osDivider}></View>
    <ThemedText style={styles.osMonoText}>Projects that match your skills:</ThemedText>
    
    <View style={styles.osMatchCard}>
      <ThemedText style={styles.osMonoText}>UI Design Project</ThemedText>
      <View style={styles.osMatchDetails}>
        <ThemedText style={styles.osMonoText}>90% match</ThemedText>
        <View style={styles.osMatchBar}>
          <View style={[styles.osMatchFill, {width: '90%'}]} />
        </View>
      </View>
    </View>
    
    <View style={styles.osMatchCard}>
      <ThemedText style={styles.osMonoText}>Backend API Development</ThemedText>
      <View style={styles.osMatchDetails}>
        <ThemedText style={styles.osMonoText}>75% match</ThemedText>
        <View style={styles.osMatchBar}>
          <View style={[styles.osMatchFill, {width: '75%'}]} />
        </View>
      </View>
    </View>
  </ThemedView>
);

export default function HomeScreen() {
  const service = TeamMemberService.getInstance();
  // Get Alice's profile (hardcoded as user 1 for demo)
  const [member, setMember] = React.useState<TeamMember>(
    service.getMemberById('1') || {
      id: '1',
      name: 'Alice Smith',
      email: 'alice@example.com',
      skills: ['React', 'Python'],
      tools: ['Laptop', 'Camera'],
      willingToHelp: true,
      borrowedItems: [],
    }
  );
  
  // Stats for the dashboard
  const [stats, setStats] = React.useState({
    pendingRequests: 3,
    activeProjects: 2,
    teamMembers: service.getAllMembers().length,
    skillsInDemand: ['React Native', 'UI Design', 'Python']
  });

  // Handle profile updates
  const handleUpdateProfile = (updatedMember: TeamMember) => {
    service.updateMember(updatedMember);
    setMember(updatedMember);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#000080', dark: '#000040' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <Header />
      <StatsDashboard stats={stats} />
      <SkillsInDemand skills={stats.skillsInDemand} />
      <ProfileSection member={member} onUpdate={handleUpdateProfile} />
      <UpcomingProjects />
      <SkillMatches />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  // Old School UI Styles
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
    opacity: 0.3,
  },
  titleContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  oldSchoolTitle: {
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  oldSchoolSubtitle: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 4,
    textAlign: 'center',
  },
  oldSchoolDivider: {
    height: 2,
    backgroundColor: '#00FF00',
    width: '100%',
    marginVertical: 8,
  },
  oldSchoolContainer: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#00FF00',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  osHeader: {
    padding: 8,
    backgroundColor: '#000080',
    borderBottomWidth: 1,
    borderBottomColor: '#00FF00',
  },
  osMenuTitle: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: 'bold',
    color: '#00FF00',
  },
  osStatsGrid: {
    padding: 8,
  },
  osStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  osStatLabel: {
    flex: 3,
  },
  osStatValue: {
    flex: 1,
    alignItems: 'flex-end',
  },
  osMonoText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
  },
  osDivider: {
    height: 1,
    backgroundColor: '#00FF00',
    width: '100%',
    marginVertical: 8,
  },
  osSkillsList: {
    padding: 8,
  },
  osSkillRow: {
    marginBottom: 8,
  },
  osSkillBar: {
    height: 8,
    backgroundColor: '#333',
    marginTop: 4,
  },
  osSkillBarFill: {
    height: 8,
    backgroundColor: '#00FF00',
  },
  osSection: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#00FF00',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  osProjectCard: {
    padding: 8,
    marginVertical: 4,
    borderLeftWidth: 2,
    borderLeftColor: '#00FF00',
  },
  osProjectTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#00FF00',
  },
  osMatchCard: {
    padding: 8,
    marginVertical: 4,
    borderLeftWidth: 2,
    borderLeftColor: '#00FF00',
  },
  osMatchDetails: {
    marginTop: 4,
  },
  osMatchBar: {
    height: 8,
    backgroundColor: '#333',
    marginTop: 4,
  },
  osMatchFill: {
    height: 8,
    backgroundColor: '#00FF00',
  },
});
